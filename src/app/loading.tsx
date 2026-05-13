export default function Loading() {
  return (
    <div style={{ background: '#060d18', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(0,255,239,0.15)', borderTopColor: '#00FFEF', animation: 'spinner 0.8s linear infinite' }} />
      <p style={{ fontSize: 14, color: '#8899aa', letterSpacing: '0.05em' }}>Betöltés...</p>
      <style>{`@keyframes spinner { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
