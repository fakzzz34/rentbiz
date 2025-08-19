import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Ini adalah database in-memory sederhana untuk tujuan demonstrasi.
// Di lingkungan produksi, Anda akan menggunakan database sungguhan.
let categories = [
  { id: "photography", name: "Fotografi", icon: "camera", color: "bg-yellow-500", description: "Kamera, lensa, drone, dan perlengkapan studio." },
  { id: "gaming", name: "Gaming", icon: "gaming", color: "bg-purple-500", description: "Konsol, PC, aksesori, dan game." },
  { id: "vehicle", name: "Kendaraan", icon: "car", color: "bg-blue-500", description: "Sepeda, motor, mobil, dan alat transportasi lainnya." },
  { id: "sports", name: "Olahraga", icon: "sports", color: "bg-green-500", description: "Peralatan olahraga, sepeda, dan perlengkapan hiking." },
  { id: "electronics", name: "Elektronik", icon: "laptop", color: "bg-cyan-500", description: "Laptop, proyektor, dan gadget lainnya." },
];

export async function GET() {
  try {
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, icon, color, description } = await request.json();

    if (!name || !icon || !color) {
      return NextResponse.json({ error: 'Name, icon, and color are required' }, { status: 400 });
    }

    const newCategory = {
      id: uuidv4(),
      name,
      icon,
      color,
      description: description || '',
    };

    categories.push(newCategory); // Menambahkan kategori baru ke array in-memory

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}
