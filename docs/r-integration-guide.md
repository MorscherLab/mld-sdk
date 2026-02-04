# R Integration Implementation Guide for MLD SDK

## Executive Summary

The MLD SDK currently has no R integration. This report details how to implement R support using the existing plugin architecture.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MLD Platform                             │
├─────────────────────────────────────────────────────────────┤
│  PlatformContext                                            │
│  ├── ExperimentRepository (read experiment data)            │
│  ├── PluginDataRepository (store plugin state)              │
│  ├── AnalysisArtifactRepository (save results)              │
│  └── CompoundListRepository (access compounds)              │
├─────────────────────────────────────────────────────────────┤
│                    Plugin Layer                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  R Analysis Plugin (Python wrapper)                  │   │
│  │  ├── FastAPI Router (HTTP endpoints)                 │   │
│  │  ├── R Executor (subprocess/rpy2)                    │   │
│  │  └── R Scripts (actual analysis code)                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Approaches

### Approach 1: Subprocess Execution (Recommended)

**Best for**: Simple scripts, isolation, any R environment

```python
# src/r_executor.py
import subprocess
import json
import tempfile
from pathlib import Path

class RExecutor:
    def __init__(self, scripts_dir: Path):
        self.scripts_dir = scripts_dir

    async def run_script(
        self,
        script_name: str,
        input_data: dict,
        timeout: int = 300
    ) -> dict:
        """Execute an R script with JSON input/output."""
        script_path = self.scripts_dir / script_name

        with tempfile.NamedTemporaryFile(
            mode='w', suffix='.json', delete=False
        ) as f_in:
            json.dump(input_data, f_in)
            input_path = f_in.name

        output_path = tempfile.mktemp(suffix='.json')

        try:
            result = subprocess.run(
                [
                    'Rscript',
                    str(script_path),
                    '--input', input_path,
                    '--output', output_path
                ],
                capture_output=True,
                text=True,
                timeout=timeout
            )

            if result.returncode != 0:
                raise RuntimeError(f"R error: {result.stderr}")

            with open(output_path) as f:
                return json.load(f)

        finally:
            Path(input_path).unlink(missing_ok=True)
            Path(output_path).unlink(missing_ok=True)
```

**Corresponding R script template**:

```r
# r_scripts/analysis.R
library(jsonlite)
library(optparse)

# Parse command line arguments
option_list <- list(
  make_option("--input", type="character", help="Input JSON file"),
  make_option("--output", type="character", help="Output JSON file")
)
opt <- parse_args(OptionParser(option_list=option_list))

# Read input data
input_data <- fromJSON(opt$input)

# === Your analysis code here ===
results <- list(
  status = "success",
  data = input_data$values * 2  # Example transformation
)

# Write output
write_json(results, opt$output, auto_unbox=TRUE)
```

---

### Approach 2: rpy2 Integration (Advanced)

**Best for**: Heavy data exchange, pandas/R dataframe interop

```python
# src/r_executor_rpy2.py
from rpy2.robjects import r, pandas2ri, conversion
from rpy2.robjects.packages import importr
import pandas as pd

class Rpy2Executor:
    def __init__(self):
        pandas2ri.activate()
        self.base = importr('base')
        self.stats = importr('stats')
        # Load your R packages

    def analyze_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Run R analysis on a pandas DataFrame."""
        # Convert pandas to R dataframe
        r_df = conversion.py2rpy(df)

        # Run R code
        r.assign('data', r_df)
        result = r('''
            # Your R analysis code
            result <- data
            result$processed <- data$value * 2
            result
        ''')

        # Convert back to pandas
        return conversion.rpy2py(result)
```

**Dependencies** (add to pyproject.toml):
```toml
[project.optional-dependencies]
r = ["rpy2>=3.5.0", "pandas>=2.0.0"]
```

---

## Complete Plugin Example

### Directory Structure

```
mld-plugin-r-analysis/
├── pyproject.toml
├── README.md
├── src/
│   └── mld_plugin_r_analysis/
│       ├── __init__.py
│       ├── plugin.py           # AnalysisPlugin subclass
│       ├── routers/
│       │   └── analysis.py     # FastAPI routes
│       ├── services/
│       │   └── r_executor.py   # R execution logic
│       └── r_scripts/
│           ├── normalize.R
│           ├── differential.R
│           └── utils.R
└── tests/
    └── test_plugin.py
```

### pyproject.toml

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "mld-plugin-r-analysis"
version = "1.0.0"
description = "R-based analysis plugin for MLD"
requires-python = ">=3.12"
dependencies = [
    "mld-sdk>=0.3.0",
    "fastapi>=0.109.0",
]

[project.optional-dependencies]
rpy2 = ["rpy2>=3.5.0", "pandas>=2.0.0"]

[project.entry-points."mld.plugins"]
r_analysis = "mld_plugin_r_analysis.plugin:RAnalysisPlugin"
```

### plugin.py

```python
from pathlib import Path
from mld_sdk import (
    AnalysisPlugin,
    PluginMetadata,
    PluginCapabilities,
    PluginType,
    PlatformContext
)
from fastapi import APIRouter

from .routers.analysis import create_router
from .services.r_executor import RExecutor


class RAnalysisPlugin(AnalysisPlugin):
    """Plugin that runs R-based analyses."""

    def __init__(self):
        self._context: PlatformContext | None = None
        self._r_executor: RExecutor | None = None

    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="r-analysis",
            version="1.0.0",
            description="R-based statistical analysis",
            analysis_type="r-statistics",
            routes_prefix="/r-analysis",
            capabilities=PluginCapabilities(
                supports_batch=True,
                supported_formats=["csv", "json"]
            )
        )

    @property
    def plugin_type(self) -> PluginType:
        return PluginType.ANALYSIS  # Read-only access

    def get_routers(self) -> list[tuple[APIRouter, str]]:
        return [(create_router(self), "")]

    async def initialize(self, context: PlatformContext | None = None) -> None:
        self._context = context
        scripts_dir = Path(__file__).parent / "r_scripts"
        self._r_executor = RExecutor(scripts_dir)

    async def shutdown(self) -> None:
        self._r_executor = None

    @property
    def context(self) -> PlatformContext | None:
        return self._context

    @property
    def r_executor(self) -> RExecutor:
        if self._r_executor is None:
            raise RuntimeError("Plugin not initialized")
        return self._r_executor
```

### routers/analysis.py

```python
from typing import TYPE_CHECKING
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

if TYPE_CHECKING:
    from ..plugin import RAnalysisPlugin


class AnalysisRequest(BaseModel):
    experiment_id: str
    script: str = "normalize.R"
    parameters: dict = {}


class AnalysisResponse(BaseModel):
    status: str
    results: dict


def create_router(plugin: "RAnalysisPlugin") -> APIRouter:
    router = APIRouter(tags=["R Analysis"])

    @router.post("/analyze", response_model=AnalysisResponse)
    async def run_analysis(request: AnalysisRequest):
        """Run R analysis on experiment data."""

        # Get experiment data from platform
        if plugin.context:
            exp_repo = plugin.context.experiments
            experiment = await exp_repo.get(request.experiment_id)
            if not experiment:
                raise HTTPException(404, "Experiment not found")
            input_data = experiment.model_dump()
        else:
            # Standalone mode - use request data directly
            input_data = request.parameters

        # Run R script
        try:
            results = await plugin.r_executor.run_script(
                request.script,
                input_data
            )
        except Exception as e:
            raise HTTPException(500, f"R execution failed: {e}")

        # Optionally save results as artifact
        if plugin.context:
            await plugin.context.artifacts.create(
                experiment_id=request.experiment_id,
                artifact_type="r-analysis-result",
                data=results
            )

        return AnalysisResponse(status="success", results=results)

    @router.get("/scripts")
    async def list_scripts():
        """List available R scripts."""
        scripts_dir = plugin.r_executor.scripts_dir
        return {
            "scripts": [
                f.name for f in scripts_dir.glob("*.R")
            ]
        }

    return router
```

### services/r_executor.py

```python
import asyncio
import json
import subprocess
import tempfile
from pathlib import Path
from typing import Any


class RExecutionError(Exception):
    """Raised when R script execution fails."""

    def __init__(self, script: str, stderr: str):
        self.script = script
        self.stderr = stderr
        super().__init__(f"R script '{script}' failed: {stderr}")


class RExecutor:
    """Execute R scripts with JSON input/output."""

    def __init__(self, scripts_dir: Path):
        self.scripts_dir = scripts_dir

    async def run_script(
        self,
        script_name: str,
        input_data: dict[str, Any],
        timeout: int = 300
    ) -> dict[str, Any]:
        """Execute an R script asynchronously."""
        script_path = self.scripts_dir / script_name

        if not script_path.exists():
            raise FileNotFoundError(f"R script not found: {script_name}")

        # Write input data to temp file
        with tempfile.NamedTemporaryFile(
            mode='w', suffix='.json', delete=False
        ) as f_in:
            json.dump(input_data, f_in)
            input_path = Path(f_in.name)

        output_path = Path(tempfile.mktemp(suffix='.json'))

        try:
            # Run R script in subprocess
            process = await asyncio.create_subprocess_exec(
                'Rscript',
                str(script_path),
                '--input', str(input_path),
                '--output', str(output_path),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            try:
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(),
                    timeout=timeout
                )
            except asyncio.TimeoutError:
                process.kill()
                raise RExecutionError(script_name, "Script execution timed out")

            if process.returncode != 0:
                raise RExecutionError(script_name, stderr.decode())

            # Read output
            if not output_path.exists():
                raise RExecutionError(script_name, "No output file generated")

            with open(output_path) as f:
                return json.load(f)

        finally:
            input_path.unlink(missing_ok=True)
            output_path.unlink(missing_ok=True)

    def run_script_sync(
        self,
        script_name: str,
        input_data: dict[str, Any],
        timeout: int = 300
    ) -> dict[str, Any]:
        """Execute an R script synchronously (for testing)."""
        script_path = self.scripts_dir / script_name

        if not script_path.exists():
            raise FileNotFoundError(f"R script not found: {script_name}")

        with tempfile.NamedTemporaryFile(
            mode='w', suffix='.json', delete=False
        ) as f_in:
            json.dump(input_data, f_in)
            input_path = Path(f_in.name)

        output_path = Path(tempfile.mktemp(suffix='.json'))

        try:
            result = subprocess.run(
                [
                    'Rscript',
                    str(script_path),
                    '--input', str(input_path),
                    '--output', str(output_path)
                ],
                capture_output=True,
                text=True,
                timeout=timeout
            )

            if result.returncode != 0:
                raise RExecutionError(script_name, result.stderr)

            with open(output_path) as f:
                return json.load(f)

        finally:
            input_path.unlink(missing_ok=True)
            output_path.unlink(missing_ok=True)
```

---

## Example R Scripts

### r_scripts/normalize.R

```r
# normalize.R - Data normalization script
library(jsonlite)
library(optparse)

option_list <- list(
  make_option("--input", type="character", help="Input JSON file"),
  make_option("--output", type="character", help="Output JSON file")
)
opt <- parse_args(OptionParser(option_list=option_list))

# Read input
input_data <- fromJSON(opt$input)
values <- input_data$values

# Normalize (z-score)
normalized <- scale(values)

# Build result
results <- list(
  status = "success",
  method = "z-score",
  data = list(
    original = values,
    normalized = as.vector(normalized),
    mean = mean(values),
    sd = sd(values)
  )
)

# Write output
write_json(results, opt$output, auto_unbox=TRUE)
```

### r_scripts/differential.R

```r
# differential.R - Differential expression analysis
library(jsonlite)
library(optparse)

option_list <- list(
  make_option("--input", type="character", help="Input JSON file"),
  make_option("--output", type="character", help="Output JSON file")
)
opt <- parse_args(OptionParser(option_list=option_list))

input_data <- fromJSON(opt$input)

# Extract groups
group1 <- input_data$group1
group2 <- input_data$group2

# Perform t-test
test_result <- t.test(group1, group2)

results <- list(
  status = "success",
  method = "t-test",
  data = list(
    p_value = test_result$p.value,
    t_statistic = test_result$statistic,
    mean_difference = mean(group1) - mean(group2),
    confidence_interval = test_result$conf.int
  )
)

write_json(results, opt$output, auto_unbox=TRUE)
```

---

## Environment Setup

### macOS (Apple Silicon)

```bash
# Option 1: Homebrew R (ARM64 native)
brew install r

# Option 2: Conda environment (matches your setup)
conda activate base  # ARM64
conda install -c conda-forge r-base r-jsonlite r-optparse

# For rpy2 approach
pip install rpy2
```

### Docker (Recommended for production)

```dockerfile
FROM python:3.12-slim

# Install R
RUN apt-get update && apt-get install -y \
    r-base \
    r-base-dev \
    && rm -rf /var/lib/apt/lists/*

# Install R packages
RUN R -e "install.packages(c('jsonlite', 'optparse'), repos='https://cloud.r-project.org/')"

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . /app
WORKDIR /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

---

## Data Exchange Patterns

### Pattern 1: JSON (Simple, Universal)

```
Python dict → JSON file → R → JSON file → Python dict
```

Best for: Structured data, API responses, small-medium datasets

### Pattern 2: CSV (Tabular Data)

```
pandas DataFrame → CSV → R data.frame → CSV → pandas DataFrame
```

Best for: Large tabular datasets, experiment results

### Pattern 3: Arrow/Parquet (High Performance)

```
pandas DataFrame → Parquet → R arrow → Parquet → pandas DataFrame
```

Best for: Very large datasets, columnar data

---

## Error Handling

```python
from mld_sdk.exceptions import PluginException

class RExecutionError(PluginException):
    """Raised when R script execution fails."""

    def __init__(self, script: str, stderr: str):
        self.script = script
        self.stderr = stderr
        super().__init__(
            message=f"R script '{script}' failed",
            code="R_EXECUTION_ERROR",
            details={"stderr": stderr}
        )
```

---

## Testing

```python
# tests/test_plugin.py
import pytest
from pathlib import Path
from mld_plugin_r_analysis.plugin import RAnalysisPlugin
from mld_plugin_r_analysis.services.r_executor import RExecutor

@pytest.fixture
async def plugin():
    p = RAnalysisPlugin()
    await p.initialize(None)  # Standalone mode
    yield p
    await p.shutdown()

@pytest.fixture
def r_executor(tmp_path):
    # Create test R script
    script = tmp_path / "test.R"
    script.write_text('''
library(jsonlite)
library(optparse)

option_list <- list(
  make_option("--input", type="character"),
  make_option("--output", type="character")
)
opt <- parse_args(OptionParser(option_list=option_list))

input_data <- fromJSON(opt$input)
results <- list(status = "success", doubled = input_data$value * 2)
write_json(results, opt$output, auto_unbox=TRUE)
''')
    return RExecutor(tmp_path)

def test_r_script_execution(r_executor):
    result = r_executor.run_script_sync(
        "test.R",
        {"value": 21}
    )
    assert result["status"] == "success"
    assert result["doubled"] == 42

async def test_plugin_metadata(plugin):
    assert plugin.metadata.name == "r-analysis"
    assert plugin.metadata.analysis_type == "r-statistics"

async def test_plugin_health(plugin):
    health = await plugin.check_health()
    assert health.status.value == "healthy"
```

---

## Checklist

- [ ] Choose approach (subprocess vs rpy2)
- [ ] Set up R environment on dev machine
- [ ] Create plugin package structure
- [ ] Implement RExecutor class
- [ ] Write R scripts for your analyses
- [ ] Create FastAPI routes
- [ ] Add error handling
- [ ] Write tests
- [ ] (Optional) Add Vue frontend
- [ ] Document R package dependencies
- [ ] Test in Docker for production parity
