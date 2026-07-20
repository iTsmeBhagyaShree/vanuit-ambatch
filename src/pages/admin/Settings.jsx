import Card from '../../components/Card';
import Button from '../../components/Button';
import { Building2, Upload, Palette, Bell, Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Instellingen</h2>
        <p className="text-dark/50 text-sm font-body">Beheer uw bedrijfs- en platforminstellingen.</p>
      </div>

      {/* Company Info */}
      <Card title="Bedrijfsinformatie" action={<div className="p-2 rounded-lg" style={{background:'#3E4E3615'}}><Building2 className="w-4 h-4 text-primary" /></div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: 'Bedrijfsnaam', value: 'Vanuit Ambacht', type: 'text' },
            { label: 'Website', value: 'www.vanuitambacht.nl', type: 'text' },
            { label: 'E-mail', value: 'info@vanuitambacht.nl', type: 'email' },
            { label: 'Telefoon', value: '+31 6 12345678', type: 'tel' },
            { label: 'Adres', value: 'Herengracht 1, Amsterdam', type: 'text' },
            { label: 'Land', value: 'Nederland', type: 'text' },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-dark/60 mb-1.5 font-body uppercase tracking-wide">{field.label}</label>
              <input
                type={field.type}
                defaultValue={field.value}
                className="w-full px-3 py-2.5 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ background: '#EDE8DF', border: '1px solid #D6CFC2', color: '#4A4A43' }}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 flex justify-end" style={{ borderTop: '1px solid #D9D2C7' }}>
          <Button icon={Save}>Wijzigingen opslaan</Button>
        </div>
      </Card>

      {/* Brand Settings */}
      <Card title="Merkinstellingen" action={<div className="p-2 rounded-lg" style={{background:'#3E4E3615'}}><Palette className="w-4 h-4 text-primary" /></div>}>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-dark/60 mb-2 font-body uppercase tracking-wide">Bedrijfslogo</label>
            <div
              className="rounded-xl p-8 text-center cursor-pointer transition-colors"
              style={{ border: '2px dashed #D6CFC2', background: '#EDE8DF' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#3E4E36'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#D6CFC2'}
            >
              <Upload className="w-7 h-7 mx-auto mb-2 text-dark/25" />
              <p className="text-sm text-dark/40 font-body">Klik om te uploaden of sleep bestand hierheen</p>
              <p className="text-xs text-dark/25 mt-1 font-body">SVG, PNG, JPG (max 2MB)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Primaire kleur', value: '#3E4E36' },
              { label: 'Accentkleur', value: '#70624F' },
              { label: 'Achtergrond', value: '#D6CFC2' },
            ].map((color, i) => (
              <div key={i}>
                <label className="block text-xs font-medium text-dark/60 mb-1.5 font-body uppercase tracking-wide">{color.label}</label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: color.value, border: '1px solid #D6CFC2' }}></div>
                  <input
                    type="text"
                    defaultValue={color.value}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ background: '#EDE8DF', border: '1px solid #D6CFC2', color: '#4A4A43' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 pt-4 flex justify-end" style={{ borderTop: '1px solid #D9D2C7' }}>
          <Button icon={Save}>Merkinstellingen opslaan</Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card title="Meldingsinstellingen" action={<div className="p-2 rounded-lg" style={{background:'#3E4E3615'}}><Bell className="w-4 h-4 text-primary" /></div>}>
        <div className="space-y-1">
          {[
            { label: 'Nieuwe lead aangemaakt', desc: 'Ontvang een melding wanneer er een nieuwe lead is', enabled: true },
            { label: 'Offerte geaccepteerd', desc: 'Ontvang een melding wanneer een offerte geaccepteerd is', enabled: true },
            { label: 'Project updated', desc: 'Ontvang een melding wanneer een projectstatus verandert', enabled: false },
            { label: 'Betaling ontvangen', desc: 'Ontvang een melding bij binnenkomende betaling', enabled: true },
          ].map((notif, i) => (
            <div key={i} className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid #D9D2C7' }}>
              <div>
                <p className="text-sm font-medium text-dark font-body">{notif.label}</p>
                <p className="text-xs text-dark/40 font-body mt-0.5">{notif.desc}</p>
              </div>
              <button
                className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                style={{ background: notif.enabled ? '#3E4E36' : '#D6CFC2' }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform"
                  style={{
                    background: notif.enabled ? '#EDE8DF' : '#D6CFC2',
                    transform: notif.enabled ? 'translateX(21px)' : 'translateX(2px)'
                  }}
                ></span>
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
