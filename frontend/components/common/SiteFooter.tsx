import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="사이트 푸터">
      <div className={styles.brandCard}>
        <span className={styles.brandEyebrow}>Craft circle</span>
        <div className={styles.brandRow}>
          <strong>은금슬쩍</strong>
          <span className={styles.brandTag}>learn, share, sell</span>
        </div>
        <p className={styles.brandDescription}>
          작업의 시작부터 공간 연결, 판매까지 이어지는 주얼리 메이커 네트워크.
        </p>
      </div>

      <div className={styles.metaRow}>
        <address className={styles.companyInfo}>
          <p>대표 메일 : sample@naver.com</p>
          <p>주소 : 경기도 화성시</p>
        </address>

        <p className={styles.copyright}>
          Copyright © 2026 eungeum-sljuck Co.,Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
