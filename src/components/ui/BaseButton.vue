<script setup>
// variant: primary | secondary | outline | danger | whatsapp | dark | ghost   size: small | medium | large
defineProps({ variant: { type: String, default: 'primary' }, size: { type: String, default: 'medium' }, block: Boolean, as: { type: String, default: 'button' }, loading: Boolean })
</script>
<template>
  <component :is="as" class="btn" :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]" :aria-busy="loading || undefined">
    <span v-if="$slots.icon" class="btn__icon"><slot name="icon" /></span>
    <slot />
  </component>
</template>
<style scoped>
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; border-radius: var(--r-full); border: 1.5px solid transparent; text-decoration: none; white-space: nowrap; transition: filter .15s, background .15s; cursor: pointer; line-height: 1.2; }
.btn:active { transform: scale(.985); } .btn[disabled], .btn[aria-busy] { opacity: .6; pointer-events: none; }
.btn--block { width: 100%; }
.btn--small { padding: 7px 14px; font-size: 12px; } .btn--medium { padding: 11px 20px; font-size: 14px; } .btn--large { padding: 14px 26px; font-size: 16px; }
.btn--primary { background: var(--navy); color: #fff; } .btn--primary:hover { filter: brightness(1.15); }
.btn--secondary { background: var(--tint); color: var(--navy); } .btn--secondary:hover { filter: brightness(.96); }
.btn--outline { background: #fff; color: var(--navy); border-color: var(--navy); } .btn--outline:hover { background: var(--tint); }
.btn--danger { background: var(--red); color: #fff; } .btn--danger:hover { filter: brightness(1.08); }
.btn--whatsapp { background: var(--green); color: #063d1a; } .btn--whatsapp:hover { filter: brightness(1.05); }
.btn--dark { background: var(--text); color: #fff; }
.btn--ghost { background: var(--bg-soft); color: var(--text); }
.btn__icon { display: inline-flex; }
</style>
