import { useEffect, useRef, useState } from 'react';

export default function ShareButton({ name, country }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    function handleScroll() { setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function handleToggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 8, left: r.left + r.width / 2 });
    }
    setOpen(o => !o);
  }

  const url = window.location.href;
  const text = `Check out ${name}${country ? `, ${country}` : ''} on TravelAI!`;

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  }
  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank');
    setOpen(false);
  }
  function shareAsPDF() {
    setOpen(false);
    const prev = document.title;
    document.title = `${name}${country ? ` - ${country}` : ''}`;
    setTimeout(() => {
      window.print();
      document.title = prev;
    }, 120);
  }

  return (
    <div ref={wrapRef} className="shrink-0">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors"
        title="Share"
      >
        <svg className="w-[18px] h-[18px] text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, transform: 'translateX(-50%)', zIndex: 9999 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-56"
        >
          <button onClick={copyLink} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0F172A] hover:bg-gray-50 transition-colors">
            {copied
              ? <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              : <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            }
            {copied ? 'Link copied!' : 'Copy link'}
          </button>

          <button onClick={shareWhatsApp} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0F172A] hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.859L.057 23.003a.75.75 0 00.94.94l5.144-1.475A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.528-5.218-1.443l-.374-.224-3.896 1.118 1.074-3.894-.232-.382A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
            </svg>
            Share on WhatsApp
          </button>

          <div className="border-t border-gray-100 mx-2 my-1" />

          <button onClick={shareAsPDF} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0F172A] hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Save as PDF
          </button>
        </div>
      )}
    </div>
  );
}
