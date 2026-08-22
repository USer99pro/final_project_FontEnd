/**
 * PublicFooter — Academic Horizon design
 * Full-bleed Deep Navy footer
 */
export default function PublicFooter() {
  const currentYear = new Date().getFullYear() + 543;

  return (
    <footer className="bg-primary text-on-primary w-full mt-auto">
      <div className="w-full px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
        <div className="flex flex-col gap-2">
          <div className="text-headline-md font-headline-md text-on-primary font-bold">
            ระบบสืบค้นผลงานวิจัย
          </div>
          <p className="text-on-primary-container text-body-md font-body-md">
            © {currentYear} University Research Repository. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end items-center">
          <span className="text-on-primary-container text-label-sm font-label-sm">
            Research Project Portal
          </span>
        </div>
      </div>
    </footer>
  );
}
