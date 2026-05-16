'use client'
import { useState } from 'react'
import Toast from '@/components/ui/Toast'
import { escapeHtml } from '@/lib/security'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToastState {
  message: string
  type: 'success' | 'error'
}

// ─── Lead Capture Form ────────────────────────────────────────────────────────

function LeadForm({
  calcType,
  resultSummary,
  onClose,
}: {
  calcType: string
  resultSummary: string
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setToast({ message: 'Név és telefonszám kötelező', type: 'error' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/calculator-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: escapeHtml(name),
          phone: escapeHtml(phone),
          calculatorType: calcType,
          calculatorResult: resultSummary,
        }),
      })
      if (res.ok) {
        setToast({ message: 'Köszönjük! Hamarosan felhívjuk.', type: 'success' })
        setTimeout(onClose, 2000)
      } else {
        setToast({ message: 'Hiba történt, kérjük próbálja újra.', type: 'error' })
      }
    } catch {
      setToast({ message: 'Kapcsolódási hiba.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 p-4 bg-[#060d18]/60 rounded-xl border border-[#00FFEF]/20">
      <p className="text-sm text-gray-300 mb-3">
        Küldjük el a részletes árajánlatot — felhívjuk!
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Neve *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Telefonszám *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
        />
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#00FFEF] text-[#060d18] py-2 rounded-lg text-sm font-semibold hover:bg-[#00FFEF]/90 disabled:opacity-50 transition"
          >
            {loading ? 'Küldés...' : 'Kérem az árajánlatot'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-gray-400 hover:text-white text-sm transition"
          >
            Mégsem
          </button>
        </div>
      </form>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

// ─── Kalkulátor 1: Mennyi kábel kell? ────────────────────────────────────────

function CableEstimator() {
  const [sqm, setSqm] = useState('')
  const [rooms, setRooms] = useState('')
  const [result, setResult] = useState<{
    cable15: number
    cable25: number
    cable4: number
    cost: string
    summary: string
  } | null>(null)
  const [showLead, setShowLead] = useState(false)

  const calculate = () => {
    const area = parseFloat(sqm)
    const roomCount = parseInt(rooms)
    if (!area || !roomCount || area <= 0 || roomCount <= 0) return

    const cable15 = Math.ceil(area * 0.8)
    const cable25 = Math.ceil(area * 1.2)
    const cable4 = Math.ceil(roomCount * 5)
    const total = cable15 * 180 + cable25 * 280 + cable4 * 450
    const cost = total.toLocaleString('hu-HU')
    const summary = `${area}m², ${roomCount} szoba → 1.5mm²: ${cable15}m, 2.5mm²: ${cable25}m, 4mm²: ${cable4}m, becsült anyagköltség: ~${cost} Ft`

    setResult({ cable15, cable25, cable4, cost, summary })
    setShowLead(false)
  }

  return (
    <div className="glass-card p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-1">Mennyi kábel kell?</h3>
      <p className="text-sm text-gray-400 mb-4">Lakásfelújításhoz szükséges kábel mennyisége</p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label htmlFor="calc-sqm" className="block text-xs text-gray-400 mb-1">Alapterület (m²)</label>
          <input
            id="calc-sqm"
            type="number"
            min="1"
            value={sqm}
            onChange={(e) => setSqm(e.target.value)}
            placeholder="pl. 65"
            className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="calc-rooms" className="block text-xs text-gray-400 mb-1">Szobák száma</label>
          <input
            id="calc-rooms"
            type="number"
            min="1"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            placeholder="pl. 3"
            className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#00FFEF] text-[#060d18] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#00FFEF]/90 transition mb-4"
      >
        Számítás
      </button>

      {result && !showLead && (
        <div className="bg-[#0d1f3c]/50 rounded-xl p-4 space-y-2 mt-auto">
          <p className="text-xs text-gray-400">Becsült szükséglet:</p>
          <p className="text-sm"><span className="text-[#00FFEF] font-medium">1.5 mm²</span> (világítás): ~{result.cable15} m</p>
          <p className="text-sm"><span className="text-[#00FFEF] font-medium">2.5 mm²</span> (konnektorok): ~{result.cable25} m</p>
          <p className="text-sm"><span className="text-[#00FFEF] font-medium">4 mm²</span> (konyha/fürdő): ~{result.cable4} m</p>
          <p className="text-base font-semibold pt-2 border-t border-[#00FFEF]/20">
            Anyagköltség: ~{result.cost} Ft
          </p>
          <p className="text-xs text-gray-500">* Tájékoztató jellegű becslés</p>
          <button
            onClick={() => setShowLead(true)}
            className="w-full mt-2 border border-[#00FFEF]/40 text-[#00FFEF] py-2 rounded-lg text-sm hover:bg-[#00FFEF]/10 transition"
          >
            Kérem a részletes árajánlatot
          </button>
        </div>
      )}

      {result && showLead && (
        <LeadForm
          calcType="Kábel becslő"
          resultSummary={result.summary}
          onClose={() => setShowLead(false)}
        />
      )}
    </div>
  )
}

// ─── Kalkulátor 2: Hány konnektor kell? ──────────────────────────────────────

function SocketRecommender() {
  const [living, setLiving] = useState('')
  const [bedroom, setBedroom] = useState('')
  const [kitchen, setKitchen] = useState('')
  const [bathroom, setBathroom] = useState('')
  const [result, setResult] = useState<{
    total: number
    usb: number
    breakdown: { label: string; count: number }[]
    summary: string
  } | null>(null)
  const [showLead, setShowLead] = useState(false)

  const calculate = () => {
    const b: Record<string, number> = {
      'Nappali': parseInt(living || '0') * 9,
      'Hálószoba': parseInt(bedroom || '0') * 7,
      'Konyha': parseInt(kitchen || '0') * 13,
      'Fürdőszoba': parseInt(bathroom || '0') * 5,
    }
    const total = Object.values(b).reduce((a, c) => a + c, 0)
    if (total === 0) return
    const usb = Math.ceil(total * 0.2)
    const breakdown = Object.entries(b)
      .filter(([, v]) => v > 0)
      .map(([label, count]) => ({ label, count }))
    const summary = `Összesen ${total} konnektor ajánlott (ebből ~${usb} db USB-s): ${breakdown.map(b => `${b.label}: ${b.count}`).join(', ')}`
    setResult({ total, usb, breakdown, summary })
    setShowLead(false)
  }

  return (
    <div className="glass-card p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-1">Hány konnektor kell?</h3>
      <p className="text-sm text-gray-400 mb-4">Modern lakás ajánlott konnektormennyisége</p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: 'Nappali (db)', val: living, set: setLiving, id: 'sock-living' },
          { label: 'Hálószoba (db)', val: bedroom, set: setBedroom, id: 'sock-bedroom' },
          { label: 'Konyha (db)', val: kitchen, set: setKitchen, id: 'sock-kitchen' },
          { label: 'Fürdőszoba (db)', val: bathroom, set: setBathroom, id: 'sock-bathroom' },
        ].map(({ label, val, set, id }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-xs text-gray-400 mb-1">{label}</label>
            <input
              id={id}
              type="number"
              min="0"
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
            />
          </div>
        ))}
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#00FFEF] text-[#060d18] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#00FFEF]/90 transition mb-4"
      >
        Számítás
      </button>

      {result && !showLead && (
        <div className="bg-[#0d1f3c]/50 rounded-xl p-4 mt-auto">
          <p className="text-2xl font-bold text-[#00FFEF] mb-3">{result.total} konnektor</p>
          <div className="space-y-1 mb-3">
            {result.breakdown.map(({ label, count }) => (
              <p key={label} className="text-sm">
                <span className="text-gray-400">{label}:</span> <strong>{count} db</strong>
              </p>
            ))}
          </div>
          <p className="text-sm text-[#00FFEF]">Ebből USB-s ajánlott: ~{result.usb} db</p>
          <button
            onClick={() => setShowLead(true)}
            className="w-full mt-3 border border-[#00FFEF]/40 text-[#00FFEF] py-2 rounded-lg text-sm hover:bg-[#00FFEF]/10 transition"
          >
            Kérem a részletes árajánlatot
          </button>
        </div>
      )}

      {result && showLead && (
        <LeadForm
          calcType="Konnektor ajánló"
          resultSummary={result.summary}
          onClose={() => setShowLead(false)}
        />
      )}
    </div>
  )
}

// ─── Kalkulátor 3: Biztosíték választó ───────────────────────────────────────

function BreakerSelector() {
  const [power, setPower] = useState('')
  const [voltage, setVoltage] = useState('230')
  const [phase, setPhase] = useState('1')
  const [result, setResult] = useState<{
    current: number
    recommended: string
    type: string
    summary: string
  } | null>(null)
  const [showLead, setShowLead] = useState(false)

  const calculate = () => {
    const p = parseFloat(power)
    const v = parseFloat(voltage)
    const ph = parseInt(phase)
    if (!p || p <= 0) return

    const current = p / (v * ph * (ph > 1 ? Math.sqrt(3) : 1))
    const safetyFactor = current * 1.25

    let recommended = '10A'
    let type = 'B karakterisztika (lakás, irodai eszközök)'
    if (safetyFactor <= 10) { recommended = '10A'; type = 'B10 — Világítás, kisebb fogyasztók' }
    else if (safetyFactor <= 16) { recommended = '16A'; type = 'B16 — Általános konnektorok, mosógép' }
    else if (safetyFactor <= 20) { recommended = '20A'; type = 'B20 — Elektromos tűzhely, bojler' }
    else if (safetyFactor <= 25) { recommended = '25A'; type = 'C25 — Klíma, ipari eszközök' }
    else if (safetyFactor <= 32) { recommended = '32A'; type = 'C32 — Nagy teljesítményű eszközök' }
    else { recommended = '40A+'; type = 'C karakterisztika — Ipari, egyedi tervezés szükséges' }

    const summary = `${p}W, ${ph} fázis, ${v}V → Áramerősség: ${current.toFixed(1)}A → Ajánlott: ${recommended} (${type})`
    setResult({ current: parseFloat(current.toFixed(1)), recommended, type, summary })
    setShowLead(false)
  }

  return (
    <div className="glass-card p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-1">Biztosíték választó</h3>
      <p className="text-sm text-gray-400 mb-4">Melyik biztosíték megfelelő az eszközéhez?</p>

      <div className="space-y-3 mb-3">
        <div>
          <label htmlFor="brk-power" className="block text-xs text-gray-400 mb-1">Teljesítmény (W)</label>
          <input
            id="brk-power"
            type="number"
            min="1"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            placeholder="pl. 3500"
            className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="brk-voltage" className="block text-xs text-gray-400 mb-1">Feszültség (V)</label>
            <select
              id="brk-voltage"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
            >
              <option value="230">230V (egyfázis)</option>
              <option value="400">400V (háromfázis)</option>
            </select>
          </div>
          <div>
            <label htmlFor="brk-phase" className="block text-xs text-gray-400 mb-1">Fázis</label>
            <select
              id="brk-phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
            >
              <option value="1">1 fázis</option>
              <option value="3">3 fázis</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#00FFEF] text-[#060d18] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#00FFEF]/90 transition mb-4"
      >
        Számítás
      </button>

      {result && !showLead && (
        <div className="bg-[#0d1f3c]/50 rounded-xl p-4 mt-auto">
          <p className="text-sm text-gray-400 mb-1">Áramerősség: <strong>{result.current}A</strong></p>
          <p className="text-2xl font-bold text-[#00FFEF] mb-2">{result.recommended}</p>
          <p className="text-sm">{result.type}</p>
          <button
            onClick={() => setShowLead(true)}
            className="w-full mt-3 border border-[#00FFEF]/40 text-[#00FFEF] py-2 rounded-lg text-sm hover:bg-[#00FFEF]/10 transition"
          >
            Kérem a részletes árajánlatot
          </button>
        </div>
      )}

      {result && showLead && (
        <LeadForm
          calcType="Biztosíték választó"
          resultSummary={result.summary}
          onClose={() => setShowLead(false)}
        />
      )}
    </div>
  )
}

// ─── Kalkulátor 4: Világítás tervező ─────────────────────────────────────────

function LightingCalculator() {
  const [sqm, setSqm] = useState('')
  const [roomType, setRoomType] = useState('living')
  const [result, setResult] = useState<{
    lux: number
    lumens: number
    ledCount: number
    watt: number
    summary: string
  } | null>(null)
  const [showLead, setShowLead] = useState(false)

  const roomTypes = [
    { value: 'living',   label: 'Nappali',       lux: 200 },
    { value: 'kitchen',  label: 'Konyha',         lux: 300 },
    { value: 'office',   label: 'Iroda/dolgozó',  lux: 500 },
    { value: 'bedroom',  label: 'Hálószoba',      lux: 150 },
    { value: 'bathroom', label: 'Fürdőszoba',     lux: 300 },
    { value: 'corridor', label: 'Folyosó',        lux: 100 },
  ]

  const calculate = () => {
    const area = parseFloat(sqm)
    if (!area || area <= 0) return
    const room = roomTypes.find(r => r.value === roomType)!
    const lumens = Math.ceil(area * room.lux)
    const ledCount = Math.ceil(lumens / 800)
    const watt = ledCount * 9
    const summary = `${area}m² ${room.label} → ${lumens} lumen szükséges → ${ledCount} db LED (á 800 lm), ~${watt}W összteljesítmény`
    setResult({ lux: room.lux, lumens, ledCount, watt, summary })
    setShowLead(false)
  }

  return (
    <div className="glass-card p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-1">Világítás tervező</h3>
      <p className="text-sm text-gray-400 mb-4">Mennyi fény kell a helyiségébe?</p>

      <div className="space-y-3 mb-3">
        <div>
          <label htmlFor="light-area" className="block text-xs text-gray-400 mb-1">Alapterület (m²)</label>
          <input
            id="light-area"
            type="number"
            min="1"
            value={sqm}
            onChange={(e) => setSqm(e.target.value)}
            placeholder="pl. 20"
            className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="light-type" className="block text-xs text-gray-400 mb-1">Helyiség típusa</label>
          <select
            id="light-type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
          >
            {roomTypes.map(r => (
              <option key={r.value} value={r.value}>{r.label} ({r.lux} lux)</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#00FFEF] text-[#060d18] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#00FFEF]/90 transition mb-4"
      >
        Számítás
      </button>

      {result && !showLead && (
        <div className="bg-[#0d1f3c]/50 rounded-xl p-4 mt-auto">
          <p className="text-sm text-gray-400 mb-1">Szükséges: <strong>{result.lumens.toLocaleString('hu-HU')} lumen</strong></p>
          <p className="text-2xl font-bold text-[#00FFEF] mb-1">{result.ledCount} db LED izzó</p>
          <p className="text-sm text-gray-300">Összteljesítmény: ~{result.watt}W</p>
          <p className="text-xs text-gray-500 mt-1">800 lumen/izzóval számolva (E27, 9W)</p>
          <button
            onClick={() => setShowLead(true)}
            className="w-full mt-3 border border-[#00FFEF]/40 text-[#00FFEF] py-2 rounded-lg text-sm hover:bg-[#00FFEF]/10 transition"
          >
            Kérem a részletes árajánlatot
          </button>
        </div>
      )}

      {result && showLead && (
        <LeadForm
          calcType="Világítás tervező"
          resultSummary={result.summary}
          onClose={() => setShowLead(false)}
        />
      )}
    </div>
  )
}

// ─── Kalkulátor 5: Kábelméretező ─────────────────────────────────────────────

function CableSizer() {
  const [current, setCurrent] = useState('')
  const [length, setLength] = useState('')
  const [material, setMaterial] = useState('cu')
  const [result, setResult] = useState<{
    minCross: number
    recommended: string
    voltageDrop: number
    summary: string
  } | null>(null)
  const [showLead, setShowLead] = useState(false)

  const calculate = () => {
    const I = parseFloat(current)
    const L = parseFloat(length)
    if (!I || !L || I <= 0 || L <= 0) return

    const resistivity = material === 'cu' ? 0.0175 : 0.028
    const maxDrop = 0.05 * 230
    const minCross = (2 * L * I * resistivity) / maxDrop

    let recommended = '1.5'
    if (minCross <= 1.5) recommended = '1.5'
    else if (minCross <= 2.5) recommended = '2.5'
    else if (minCross <= 4) recommended = '4'
    else if (minCross <= 6) recommended = '6'
    else if (minCross <= 10) recommended = '10'
    else if (minCross <= 16) recommended = '16'
    else recommended = '25+'

    const actualCross = parseFloat(recommended === '25+' ? '25' : recommended)
    const R = (2 * L * resistivity) / actualCross
    const voltageDrop = parseFloat((I * R).toFixed(1))

    const summary = `${I}A, ${L}m, ${material === 'cu' ? 'réz' : 'alumínium'} → Min. keresztmetszet: ${minCross.toFixed(2)}mm² → Ajánlott: ${recommended}mm², feszültségesés: ${voltageDrop}V`
    setResult({ minCross: parseFloat(minCross.toFixed(2)), recommended, voltageDrop, summary })
    setShowLead(false)
  }

  return (
    <div className="glass-card p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-1">Kábelméretező</h3>
      <p className="text-sm text-gray-400 mb-4">Mekkora keresztmetszetű kábel kell?</p>

      <div className="space-y-3 mb-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="sizer-current" className="block text-xs text-gray-400 mb-1">Áramerősség (A)</label>
            <input
              id="sizer-current"
              type="number"
              min="0.1"
              step="0.1"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="pl. 16"
              className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="sizer-length" className="block text-xs text-gray-400 mb-1">Kábel hossza (m)</label>
            <input
              id="sizer-length"
              type="number"
              min="1"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="pl. 25"
              className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="sizer-material" className="block text-xs text-gray-400 mb-1">Anyag</label>
          <select
            id="sizer-material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-3 py-2 bg-[#0d1f3c] border border-[#00FFEF]/20 rounded-lg text-sm focus:border-[#00FFEF] focus:outline-none"
          >
            <option value="cu">Réz (ajánlott)</option>
            <option value="al">Alumínium</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#00FFEF] text-[#060d18] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#00FFEF]/90 transition mb-4"
      >
        Számítás
      </button>

      {result && !showLead && (
        <div className="bg-[#0d1f3c]/50 rounded-xl p-4 mt-auto">
          <p className="text-sm text-gray-400 mb-1">Min. szükséges: <strong>{result.minCross} mm²</strong></p>
          <p className="text-2xl font-bold text-[#00FFEF] mb-1">{result.recommended} mm²</p>
          <p className="text-sm text-gray-300">Feszültségesés: {result.voltageDrop}V</p>
          <p className="text-xs mt-1 text-gray-500">
            {result.voltageDrop <= 11.5
              ? '✓ Megfelel az 5%-os határnak'
              : '⚠ Nagyobb keresztmetszet ajánlott'}
          </p>
          <button
            onClick={() => setShowLead(true)}
            className="w-full mt-3 border border-[#00FFEF]/40 text-[#00FFEF] py-2 rounded-lg text-sm hover:bg-[#00FFEF]/10 transition"
          >
            Kérem a részletes árajánlatot
          </button>
        </div>
      )}

      {result && showLead && (
        <LeadForm
          calcType="Kábelméretező"
          resultSummary={result.summary}
          onClose={() => setShowLead(false)}
        />
      )}
    </div>
  )
}

// ─── Fő Hub komponens ─────────────────────────────────────────────────────────

export default function CalculatorHub() {
  return (
    <section id="kalkulator" className="py-20 px-4 bg-gradient-to-b from-[#0d1f3c] to-[#060d18]">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#00FFEF] text-sm font-semibold tracking-wider mb-2 uppercase">
          Ingyenes eszközök
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Számoljon velünk —{' '}
          <span className="text-[#00FFEF]">pillanatok alatt</span>
        </h2>
        <p className="text-gray-400 mb-12 max-w-2xl">
          Mielőtt bejönne hozzánk vagy ajánlatot kérne, ezekkel a kalkulátorokkal
          előzetesen felmérheti, mire lesz szüksége. Az eredmény alapján
          részletes árajánlatot küldünk — ingyenesen, kötelezettség nélkül.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CableEstimator />
          <SocketRecommender />
          <BreakerSelector />
          <LightingCalculator />
          <CableSizer />
        </div>

        <p className="text-xs text-gray-600 mt-8 text-center">
          * Minden kalkulátor tájékoztató jellegű eredményt ad.
          Pontos tervezéshez forduljon szakemberünkhöz személyesen vagy telefonon.
        </p>
      </div>
    </section>
  )
}
