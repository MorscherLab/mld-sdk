<script setup lang="ts">
import { ResourceCard } from '@morscherlab/mld-sdk'
import type { ResourceStatus, ResourceSpec } from '@morscherlab/mld-sdk'

const orbitrapSpecs: ResourceSpec[] = [
  { label: 'Resolution', value: '240,000 FWHM' },
  { label: 'Mass Range', value: '50-6,000 m/z' },
  { label: 'Scan Rate', value: '12 Hz' },
]

const statuses: { status: ResourceStatus; name: string; location: string }[] = [
  { status: 'available', name: 'Agilent 6545 Q-TOF', location: 'Lab A, Bench 3' },
  { status: 'in-use', name: 'Thermo TSQ Quantis', location: 'Lab B, Bench 1' },
  { status: 'maintenance', name: 'Bruker timsTOF Pro', location: 'Lab C, Bench 2' },
  { status: 'offline', name: 'Waters Xevo G2-XS', location: 'Lab A, Bench 5' },
]
</script>

<template>
  <DemoSection title="Card Mode">
    <div class="max-w-md">
      <ResourceCard
        name="Orbitrap Q-Exactive HF"
        description="High-resolution accurate mass spectrometer for proteomics, metabolomics, and small molecule analysis."
        status="available"
        location="Lab A, Bench 1"
        :specs="orbitrapSpecs"
        :tags="['LC-MS', 'High-Res', 'Proteomics']"
        show-book-action
      />
    </div>
  </DemoSection>

  <DemoSection title="Status Variants">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ResourceCard
        v-for="item in statuses"
        :key="item.status"
        :name="item.name"
        :status="item.status"
        :location="item.location"
        show-book-action
      />
    </div>
  </DemoSection>

  <DemoSection title="Compact Mode">
    <div class="flex flex-col gap-2 max-w-lg">
      <ResourceCard
        v-for="item in statuses"
        :key="item.status"
        :name="item.name"
        :status="item.status"
        :location="item.location"
        compact
      />
    </div>
  </DemoSection>

  <DemoSection title="No Book Action">
    <div class="max-w-md">
      <ResourceCard
        name="Thermo TSQ Quantis"
        description="Triple quadrupole mass spectrometer for targeted quantitation."
        status="available"
        location="Lab B, Bench 1"
        :show-book-action="false"
      />
    </div>
  </DemoSection>

  <DemoSection title="With Next Available">
    <div class="max-w-md">
      <ResourceCard
        name="Agilent 6545 Q-TOF"
        description="Quadrupole time-of-flight mass spectrometer for accurate mass measurements."
        status="in-use"
        location="Lab A, Bench 3"
        next-available="Today at 15:30"
        :tags="['LC-MS', 'Q-TOF']"
        show-book-action
      />
    </div>
  </DemoSection>
</template>
