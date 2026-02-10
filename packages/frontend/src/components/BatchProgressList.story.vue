<script setup lang="ts">
import BatchProgressList from './BatchProgressList.vue'

const mixedItems = [
  { id: 'b1', label: 'Sample_Control_Rep1.raw', status: 'completed' as const },
  { id: 'b2', label: 'Sample_Control_Rep2.raw', status: 'completed' as const },
  { id: 'b3', label: 'Sample_Control_Rep3.raw', status: 'completed' as const },
  { id: 'b4', label: 'Sample_Treatment_Rep1.raw', status: 'processing' as const, progress: 67 },
  { id: 'b5', label: 'Sample_Treatment_Rep2.raw', status: 'pending' as const },
  { id: 'b6', label: 'Sample_Treatment_Rep3.raw', status: 'pending' as const },
  { id: 'b7', label: 'Sample_Vehicle_Rep1.raw', status: 'error' as const, message: 'File format not recognized. Expected .mzML or .raw format but received corrupted header.' },
  { id: 'b8', label: 'Sample_Vehicle_Rep2.raw', status: 'skipped' as const },
]

const allCompleted = [
  { id: 'c1', label: 'Plate1_Analysis.xlsx', status: 'completed' as const },
  { id: 'c2', label: 'Plate2_Analysis.xlsx', status: 'completed' as const },
  { id: 'c3', label: 'Plate3_Analysis.xlsx', status: 'completed' as const },
  { id: 'c4', label: 'Combined_Report.pdf', status: 'completed' as const },
]

function initState() {
  return {
    items: mixedItems,
    showSummary: true,
    title: 'Processing Raw Data Files',
    autoScroll: true,
  }
}
</script>

<template>
  <Story title="Workflow/BatchProgressList">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px;">
          <BatchProgressList
            :items="state.items"
            :show-summary="state.showSummary"
            :title="state.title"
            :auto-scroll="state.autoScroll"
            @retry="(id) => console.log('Retry:', id)"
            @cancel="(id) => console.log('Cancel:', id)"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.showSummary" title="Show Summary" />
        <HstText v-model="state.title" title="Title" />
        <HstCheckbox v-model="state.autoScroll" title="Auto Scroll" />
      </template>
    </Variant>

    <Variant title="All Completed">
      <div style="padding: 2rem; max-width: 500px;">
        <BatchProgressList
          :items="allCompleted"
          title="Export Complete"
        />
      </div>
    </Variant>

    <Variant title="With Max Height">
      <div style="padding: 2rem; max-width: 500px;">
        <BatchProgressList
          :items="mixedItems"
          title="Processing Files"
          max-height="250px"
        />
      </div>
    </Variant>

    <Variant title="No Title">
      <div style="padding: 2rem; max-width: 500px;">
        <BatchProgressList :items="mixedItems" />
      </div>
    </Variant>

    <Variant title="All Pending">
      <div style="padding: 2rem; max-width: 500px;">
        <BatchProgressList
          :items="[
            { id: 'p1', label: 'Analysis_Run_1.csv', status: 'pending' },
            { id: 'p2', label: 'Analysis_Run_2.csv', status: 'pending' },
            { id: 'p3', label: 'Analysis_Run_3.csv', status: 'pending' },
          ]"
          title="Queued for Processing"
        />
      </div>
    </Variant>
  </Story>
</template>
