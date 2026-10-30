<script setup>
import { ref, computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import ModalBox from '../ui/ModalBox.vue'
import TabsBar from '../ui/TabsBar.vue'
import ActionConfirm from '../ui/ActionConfirm.vue'
import { liveFaqs, pendingFaqs, rejectedFaqs, approveFaq, rejectFaq, restoreFaq, toggleFaqHidden, removeFaq } from '../../stores/store'
import { toast } from '../../stores/toast'
const tab = ref('live')
const tabs = computed(() => [{ key: 'live', label: 'FAQ Tayang', count: liveFaqs.value.length }, { key: 'pending', label: 'Pertanyaan Masuk', count: pendingFaqs.value.length }, { key: 'rejected', label: 'Ditolak', count: rejectedFaqs.value.length }])
const ans = ref(null), answer = ref(''), err = ref(''), hide = ref(null), del = ref(null)
const MAX = 300
function openAnswer(f, editing = false) { ans.value = { f, editing }; answer.value = f.a || ''; err.value = '' }
function publish() {
  if (answer.value.trim().length < 3) { err.value = 'Jawaban wajib diisi.'; return }
  approveFaq(ans.value.f.id, answer.value); toast(ans.value.editing ? 'Jawaban diperbarui.' : 'Pertanyaan disetujui dan tampil di FAQ.'); ans.value = null
}
function reject(f) { rejectFaq(f.id); ans.value = null; toast('Pertanyaan ditolak.') }
function doHide() { toggleFaqHidden(hide.value.id); toast(hide.value.hidden ? 'FAQ disembunyikan dari website.' : 'FAQ ditampilkan.'); hide.value = null }
</script>
<template>
  <section id="faq" class="a-section">
    <div class="a-head"><h2>Kelola FAQ</h2></div>
    <TabsBar v-model="tab" :tabs="tabs" />

    <template v-if="tab === 'live'">
      <h3>Daftar FAQ ({{ liveFaqs.length }} item)</h3>
      <p v-if="!liveFaqs.length" class="muted emp">Belum ada FAQ yang tayang.</p>
      <article v-for="f in liveFaqs" :key="f.id" class="fq" :class="{ off: f.hidden }">
        <span class="badge" :class="f.hidden ? 'badge--mute' : 'badge--on'">{{ f.hidden ? 'Disembunyikan' : 'Tayang' }}</span>
        <p class="q">{{ f.q }}</p><p class="an">{{ f.a }}</p>
        <div class="ac">
          <button class="bt bt--ghost" @click="openAnswer(f, true)"><AppIcon name="edit" :size="14" />Ubah jawaban</button>
          <button class="bt bt--navy-o" @click="f.hidden ? toggleFaqHidden(f.id) : (hide = f)"><AppIcon :name="f.hidden ? 'eye' : 'eye-off'" :size="14" />{{ f.hidden ? 'Tampilkan' : 'Sembunyikan' }}</button>
          <button class="bt bt--red-o" @click="del = f"><AppIcon name="trash" :size="14" />Hapus</button>
        </div>
      </article>
    </template>

    <template v-else-if="tab === 'pending'">
      <h3>Menunggu Persetujuan ({{ pendingFaqs.length }} item)</h3>
      <p v-if="!pendingFaqs.length" class="muted emp">Tidak ada pertanyaan yang menunggu.</p>
      <div class="gd">
        <article v-for="f in pendingFaqs" :key="f.id" class="cd">
          <div class="who"><span class="av">{{ f.name.charAt(0) }}</span><strong>{{ f.name }}</strong><span class="badge badge--warn">Status Pending</span></div>
          <p class="q">{{ f.q }}</p>
          <div class="ac2"><button class="bt bt--red-o" @click="reject(f)">Tolak</button><button class="bt bt--navy" @click="openAnswer(f)">Jawab</button></div>
        </article>
      </div>
    </template>

    <template v-else>
      <h3>Pertanyaan Ditolak ({{ rejectedFaqs.length }} item)</h3>
      <p v-if="!rejectedFaqs.length" class="muted emp">Tidak ada pertanyaan yang ditolak.</p>
      <div class="gd">
        <article v-for="f in rejectedFaqs" :key="f.id" class="cd cd--off">
          <div class="who"><span class="av">{{ f.name.charAt(0) }}</span><strong>{{ f.name }}</strong></div>
          <p class="q q--mute">{{ f.q }}</p><span class="badge badge--off">● Ditolak</span>
          <div class="ac2"><button class="bt bt--navy-o grow" @click="restoreFaq(f.id); toast('Pertanyaan dipulihkan ke daftar masuk.')"><AppIcon name="undo" :size="14" />Pulihkan</button><button class="bt bt--red-o" aria-label="Hapus permanen" @click="del = f"><AppIcon name="trash" :size="14" /></button></div>
        </article>
      </div>
    </template>

    <ModalBox :open="!!ans" title="Jawab Pertanyaan" width="460px" @close="ans = null">
      <div v-if="ans" class="qb"><small>Pertanyaan dari {{ ans.f.name }}<span v-if="!ans.editing" class="badge badge--warn">Status Pending</span></small><strong>{{ ans.f.q }}</strong></div>
      <label class="label" for="jw">Jawaban</label>
      <textarea id="jw" v-model="answer" class="input" :class="{ invalid: err }" rows="4" :maxlength="MAX" placeholder="Tulis jawaban yang akan tampil di FAQ" />
      <p class="ctr">{{ answer.length }} dari {{ MAX }} karakter</p><p v-if="err" class="err">{{ err }}</p>
      <template #footer>
        <button v-if="ans && !ans.editing" class="bt bt--red-o mr" @click="reject(ans.f)">✕ Tolak</button>
        <button class="bt bt--out" @click="ans = null">Batal</button>
        <button class="bt bt--green" @click="publish"><AppIcon name="check" :size="14" />{{ ans?.editing ? 'Simpan' : 'Setujui & Tayangkan' }}</button>
      </template>
    </ModalBox>
    <ActionConfirm :open="!!hide" title="Sembunyikan FAQ ini?" message="FAQ tidak akan tampil di halaman publik, tetapi tetap tersimpan dan bisa ditampilkan kembali kapan saja." item-label="FAQ yang dipilih" :item-text="hide?.q" icon="eye-off" tone="primary" confirm-label="Ya, Sembunyikan" @confirm="doHide" @cancel="hide = null" />
    <ActionConfirm :open="!!del" title="Hapus FAQ ini?" message="FAQ akan dihapus permanen dari halaman publik dan tidak bisa dikembalikan." item-label="FAQ yang dipilih" :item-text="del?.q" @confirm="removeFaq(del.id); del = null; toast('FAQ dihapus.')" @cancel="del = null" />
  </section>
</template>
<style scoped>
h3 { font-size: 14px; font-weight: 500; margin-bottom: 10px; } .emp { font-size: 13px; padding: 6px 0; }
.fq .badge { justify-self: start; } .fq { background: #fff; border: 1px solid var(--border); border-radius: var(--r-8); padding: 12px; margin-bottom: 10px; display: grid; gap: 6px; } .fq.off { background: var(--bg-soft); }
.q { font-size: 13px; font-weight: 700; } .q--mute { font-weight: 400; color: var(--muted); } .an { font-size: 12px; color: var(--muted); }
.ac { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; border-top: 1px solid var(--border); padding-top: 10px; margin-top: 4px; } .ac2 { display: flex; gap: 8px; } .ac2 .bt { flex: 1; justify-content: center; } .ac2 .grow { flex: 1; }
.gd { display: grid; gap: 10px; } .cd { background: #fff; border: 1px solid var(--border); border-radius: var(--r-8); padding: 12px; display: grid; gap: 8px; align-content: start; } .cd--off { background: var(--bg-soft); }
.who { display: flex; align-items: center; gap: 6px; font-size: 12px; flex-wrap: wrap; } .who .badge { margin-left: auto; } .av { width: 18px; height: 18px; border-radius: 50%; background: #E7E8EB; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }
.badge--warn { background: #FFF4E5; color: #B45309; border-color: #F5C98B; } .badge--mute { background: var(--bg-soft); color: var(--muted); border-color: var(--border); }
.bt { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: var(--r-6); border: 1px solid transparent; font-size: 12px; font-weight: 600; background: #fff; }
.bt--ghost { border-color: var(--border); color: var(--text); } .bt--out { border-color: var(--border); } .bt--navy { background: var(--navy); color: #fff; } .bt--navy-o { border-color: var(--navy); color: var(--navy); } .bt--red-o { border-color: var(--red); color: var(--red); } .bt--green { background: #4D8C1A; color: #fff; } .mr { margin-right: auto; }
.qb { background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--r-8); padding: 10px 12px; display: grid; gap: 4px; } .qb small { font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; align-items: center; } .qb strong { font-size: 13px; }
.label { margin-top: 14px; } .ctr { font-size: 10px; color: var(--muted); text-align: right; margin: 4px 0 0; }
@media (min-width: 720px) { .gd { grid-template-columns: repeat(3, 1fr); } }
</style>
