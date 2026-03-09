import Link from 'next/link';

const pageStyle = {
  minHeight: '100vh',
  background: '#fff',
  color: '#111',
  display: 'grid',
  placeItems: 'center',
  padding: '16px'
};

const boxStyle = {
  border: '1px solid #8f8f8f',
  borderRadius: '10px',
  width: 'min(560px, 100%)',
  padding: '20px'
};

const linkStyle = {
  display: 'inline-block',
  marginTop: '12px',
  border: '1px solid #111',
  borderRadius: '8px',
  background: '#111',
  color: '#fff',
  textDecoration: 'none',
  padding: '8px 12px',
  fontSize: '13px'
};

export default function MarketNewPage() {
  return (
    <main style={pageStyle}>
      <section style={boxStyle}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>판매 등록 페이지</h1>
        <p style={{ margin: '8px 0 0', color: '#666', fontSize: '14px' }}>
          공방 쉐어 등록 화면 자리입니다.
        </p>
        <Link href="/market" style={linkStyle}>
          마켓으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
