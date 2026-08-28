import { useEffect } from 'react';

export default function SEOHead({
  title = 'คลังข้อมูลงานวิจัยมหาวิทยาลัย | ระบบสืบค้นผลงานวิชาการและนวัตกรรม',
  description = 'คลังข้อมูลงานวิจัยมหาวิทยาลัย ค้นหางานวิจัย นวัตกรรม วิทยานิพนธ์ และบทความวิชาการจากนักศึกษาและบุคลากร ครอบคลุมวิทยาการคอมพิวเตอร์ วิศวกรรมศาสตร์ และบริหารธุรกิจ',
  canonicalUrl = 'https://udvc-research.online/',
}) {
  useEffect(() => {
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = description;
      document.head.appendChild(metaDesc);
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonicalUrl);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      linkCanonical.href = canonicalUrl;
      document.head.appendChild(linkCanonical);
    }
  }, [title, description, canonicalUrl]);

  return null;
}
