<script setup>
import { ref, computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import TabsBar from '../ui/TabsBar.vue'
import ActionConfirm from '../ui/ActionConfirm.vue'
import { liveTestimonials, pendingTestimonials, rejectedTestimonials, approveTestimonial, rejectTestimonial, restoreTestimonial, toggleTestimonialHidden, removeTestimonial } from '../../stores/store'
import { toast } from '../../stores/toast'
const tab = ref('live')
const tabs = computed(() => [{ key: 'live', label: 'Testimoni Tayang', count: liveTestimonials.value.length }, { key: 'pending', label: 'Menunggu Persetujuan', count: pendingTestimonials.value.length }, { key: 'rejected', label: 'Ditolak', count: rejectedTestimonials.value.length }])
const hide = ref(null), del = ref(null)
function doHide() { toggleTestimonialHidden(hide.value.id); toast('Testimoni disembunyikan dari website.'); hide.value = null }
</script>
<template>
  <section id="testimoni" class="a-section">
    <div class="a-head"><h2>Kelola Testimoni Pelanggan</h2></div>
    <TabsBar v-model="tab" :tabs="tabs" />

    <template v-if="tab === 'live'">
      <h3>Daftar Testimoni ({{ liveTestimonials.length }} item)</h3>
      <p v-if="!liveTestimonials.length" class="muted emp">Belum ada testimoni yang tayang.</p>
      <div class="gd">
        <article v-for="t in liveTestimonials" :key="t.id" class="cd" :class="{ 'cd--off': t.hidden }">
          <div class="who"><span class="av">{{ t.name.charAt(0) }}</span><strong>{{ t.name }}</strong></div>
          <p class="tx">{{ t.text }}</p>
          <div class="row"><span class="badge" :class="t.hidden ? 'badge--mute' : 'badge--on'">● {{ t.hidden ? 'Disembunyikan' : 'Tayang' }}</span><span class="lk"><AppIcon name="thumbs-up" :size="12" />{{ t.likes }}</span></div>
          <div class="ac2">
            <button class="bt bt--navy-o grow" @click="t.hidden ? toggleTestimonialHidden(t.id) : (hide = t)"><AppIcon :name="t.hidden ? 'eye' : 'eye-off'" :size="14" />{{ t.hidden ? 'Tampilkan' : 'Sembunyikan' }}</button>
            <button class="bt bt--red-o" :aria-label="`Hapus testimoni ${t.name}`" @click="del = t"><AppIcon name="trash" :size="14" /></button>
          </div>
        </article>
      </div>
    </template>

    <template v-else-if="tab === 'pending'">
      <h3>Menunggu Persetujuan ({{ pendingTestimonials.length }} item)</h3>
      <p v-if="!pendingTestimonials.length" class="muted emp">Tidak ada testimoni yang menunggu.</p>
      <div class="gd">
        <article v-for="t in pendingTestimonials" :key="t.id" class="cd">
          <div class="who"><span class="av">{{ t.name.charAt(0) }}</span><strong>{{ t.name }}</strong></div>
          <p class="tx">{{ t.text }}</p><span class="badge badge--warn">Status Pending</span>
          <div class="ac2"><button class="bt bt--red-o" @click="rejectTestimonial(t.id); toast('Testimoni ditolak.')">✕ Tolak</button><button class="bt bt--green" @click="approveTestimonial(t.id); toast('Testimoni disetujui dan tampil.')"><AppIcon name="check" :size="14" />Setujui</button></div>
        </article>
      </div>
    </template>

    <template v-else>
      <h3>Testimoni Ditolak ({{ rejectedTestimonials.length }} item)</h3>
      <p v-if="!rejectedTestimonials.length" class="muted emp">Tidak ada testimoni yang ditolak.</p>
      <div class="gd">
        <article v-for="t in rejectedTestimonials" :key="t.id" class="cd cd--off">
          <div class="who"><span class="av">{{ t.name.charAt(0) }}</span><strong>{{ t.name }}</strong></div>
          <p class="tx tx--mute">{{ t.text }}</p><span class="badge badge--off">● Ditolak</span>
          <div class="ac2"><button class="bt bt--navy-o grow" @click="restoreTestimonial(t.id); toast('Testimoni dipulihkan ke daftar menunggu.')"><AppIcon name="undo" :size="14" />Pulihkan</button><button class="bt bt--red-o" aria-label="Hapus permanen" @click="del = t"><AppIcon name="trash" :size="14" /></button></div>
        </article>
      </div>
    </template>

    <ActionConfirm :open="!!hide" title="Sembunyikan testimoni ini?" message="Testimoni tidak akan tampil di halaman publik, tetapi tetap tersimpan dan bisa ditampilkan kembali kapan saja." :item-label="`Testimoni dari ${hide?.name}`" :item-text="hide?.text" icon="eye-off" tone="primary" confirm-label="Ya, Sembunyikan" @confirm="doHide" @cancel="hide = null" />
    <ActionConfirm :open="!!del" title="Hapus testimoni ini?" message="Testimoni akan dihapus permanen dan tidak bisa dikembalikan." :item-label="`Testimoni dari ${del?.name}`" :item-text="del?.text" @confirm="removeTestimonial(del.id); del = null; toast('Testimoni dihapus.')" @cancel="del = null" />
  </section>
</template>
<style scoped>
h3 { font-size: 14px; font-weight: 500; margin-bottom: 10px; } .emp { font-size: 13px; padding: 6px 0; }
.gd { display: grid; gap: 10px; } .cd { background: #fff; border: 1px solid var(--border); border-radius: var(--r-8); padding: 12px; display: grid; gap: 8px; align-content: start; } .cd--off { background: var(--bg-soft); }
.who { display: flex; align-items: center; gap: 6px; font-size: 12px; } .av { width: 18px; height: 18px; border-radius: 50%; background: #E7E8EB; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }
.tx { font-size: 12px; color: #3a4150; } .tx--mute { color: var(--muted); } .row { display: flex; justify-content: space-between; align-items: center; } .lk { display: inline-flex; gap: 4px; align-items: center; font-size: 11px; color: var(--muted); }
.badge--warn { background: #FFF4E5; color: #B45309; border-color: #F5C98B; justify-self: start; } .badge--mute { background: #fff; color: var(--muted); border-color: var(--border); } .badge--off { justify-self: start; }
.ac2 { display: flex; gap: 8px; } .ac2 .bt { flex: 1; justify-content: center; } .ac2 .bt[aria-label] { flex: 0 0 auto; } .grow { flex: 1; }
.bt { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: var(--r-6); border: 1px solid transparent; font-size: 12px; font-weight: 600; background: #fff; }
.bt--navy-o { border-color: var(--navy); color: var(--navy); } .bt--red-o { border-color: var(--red); color: var(--red); } .bt--green { background: #4D8C1A; color: #fff; }
@media (min-width: 720px) { .gd { grid-template-columns: repeat(3, 1fr); } }
</style>
