import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: restaurants, error } = await supabase
      .from('restaurant')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    const { data: allReviews, error: reviewsError } = await supabase
      .from('review')
      .select('*')
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Supabase reviews error:', reviewsError);
    }

    const restaurantsWithReviews = restaurants?.map(restaurant => {
      const reviews = allReviews?.filter(review => review.restaurant_id === restaurant.id) || [];
      
      const avgRating = reviews.length > 0
        ? Math.round(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length)
        : restaurant.rating || 0;

      return {
        id: restaurant.id,
        name: restaurant.name,
        category: restaurant.category,
        description: restaurant.description,
        image_url: restaurant.image_url,
        created_at: restaurant.created_at,
        rating: avgRating,
        visits: reviews.length,
        reviews: reviews.map(r => ({
          author: 'Usuário',
          rating: r.rating,
          comment: r.opinion || '',
          date: r.created_at,
        })),
      };
    });

    return NextResponse.json({ data: restaurantsWithReviews }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar restaurantes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Nome e categoria são obrigatórios" },
        { status: 400 }
      );
    }

    if (!imageFile) {
      return NextResponse.json(
        { error: "Imagem é obrigatória" },
        { status: 400 }
      );
    }

    // Criar o restaurante primeiro para obter o ID
    const { data: restaurant, error: insertError } = await supabase
      .from('restaurant')
      .insert({
        name,
        description,
        category,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }

    // Upload da imagem para o Supabase Storage usando o ID do restaurante
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${restaurant.id}.${fileExt}`;
    const filePath = `restaurants/${fileName}`;

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase
      .storage
      .from('photos')
      .upload(filePath, buffer, {
        contentType: imageFile.type,
        upsert: true,
      });

    if (uploadError) {
      // Se falhar o upload, deletar o restaurante criado
      await supabase.from('restaurant').delete().eq('id', restaurant.id);
      return NextResponse.json(
        { error: `Erro ao fazer upload da imagem: ${uploadError.message}` },
        { status: 400 }
      );
    }

    // Obter a URL pública da imagem
    const { data: publicUrl } = supabase
      .storage
      .from('photos')
      .getPublicUrl(filePath);

    // Atualizar o restaurante com a URL da imagem
    const { data: updatedRestaurant, error: updateError } = await supabase
      .from('restaurant')
      .update({ image_url: publicUrl.publicUrl })
      .eq('id', restaurant.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: updatedRestaurant }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar restaurante' },
      { status: 500 }
    );
  }
}