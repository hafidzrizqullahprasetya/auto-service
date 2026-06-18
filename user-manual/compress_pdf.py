#!/usr/bin/env python3
"""
Script untuk compress PDF sambil mempertahankan kualitas
"""
import os
import sys
from pathlib import Path

def compress_pdf(pdf_path, output_path=None):
    """
    Compress PDF menggunakan Ghostscript
    Args:
        pdf_path: path ke PDF
        output_path: path output (optional, default: add _compressed)
    """
    if output_path is None:
        name = Path(pdf_path).stem
        ext = Path(pdf_path).suffix
        output_path = f"{name}_compressed{ext}"

    # Check file size
    size_before = os.path.getsize(pdf_path) / (1024 * 1024)  # MB

    # Gunakan ghostscript untuk compress
    cmd = f'gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -dDetectDuplicateImages -r150x150 -sOutputFile="{output_path}" "{pdf_path}"'

    print(f"Compressing PDF: {pdf_path}")
    print(f"Output: {output_path}\n")

    os.system(cmd)

    if os.path.exists(output_path):
        size_after = os.path.getsize(output_path) / (1024 * 1024)  # MB
        reduction = ((size_before - size_after) / size_before * 100)

        print(f"\n{'='*50}")
        print(f"Sebelum: {size_before:.2f}MB")
        print(f"Sesudah: {size_after:.2f}MB")
        print(f"Pengurangan: {size_before - size_after:.2f}MB ({reduction:.1f}%)")
        print(f"{'='*50}\n")
        print(f"✓ Berhasil! Output: {output_path}")
    else:
        print("✗ Kompresi gagal. Pastikan ghostscript terinstall!")
        sys.exit(1)

def main():
    pdf_files = list(Path('.').glob('*.pdf'))

    if not pdf_files:
        print("Tidak ada file PDF di folder ini!")
        sys.exit(1)

    for pdf_file in pdf_files:
        compress_pdf(str(pdf_file))

if __name__ == '__main__':
    main()
