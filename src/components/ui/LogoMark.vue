<script setup>
defineProps({ size: { type: Number, default: 36 } })
</script>
<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" aria-hidden="true">
    <polygon points="6,92 34,22 62,92" fill="#1A3673" />
    <polygon points="26,84 56,6 86,84" fill="#3B82C4" />
    <path d="M4,97 C30,72 62,48 95,35 L97,52 C70,57 44,73 4,97 Z" fill="#D93627" opacity=".92" />
  </svg>
</template>
