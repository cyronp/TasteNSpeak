"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
const categorias = ["Restaurante", "Café", "Outros"];
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export default function AddRestaurant() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("category", selectedCategory);

    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao adicionar restaurante");
      }

      alert("Restaurante adicionado com sucesso!");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="py-4">
        <h1 className="text-2xl font-bold">Adicionar estabelecimento</h1>
        <h2 className="font-semibold text-muted-foreground">
          Realize o cadastro do estabelecimento
        </h2>
      </div>
      {error && (
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}
      <form
        className="grid grid-cols-1 gap-6"
        id="form-register"
        onSubmit={handleSubmit}
      >
        <Field>
          <FieldLabel htmlFor="input-field-image">
            Imagem do estabelecimento{" "}
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="input-field-image"
            name="image"
            type="file"
            accept="image/*"
            required
          />
          <FieldDescription>
            Selecione uma imagem do estabelecimento
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-field-restaurant">
            Nome do estabelecimento <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="input-field-restaurant"
            name="name"
            type="text"
            placeholder="Insira o nome do estabelecimento"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-field-description">
            Descrição sobre o estabelecimento (opcional)
          </FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id="input-field-description"
              name="description"
              placeholder="Insira a descrição do estabelecimento"
              className="min-h-24 resize-none"
              rows={6}
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel>
            Selecione a categoria <span className="text-destructive">*</span>
          </FieldLabel>
          <Combobox
            items={categorias}
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value || "")}
          >
            <ComboboxInput placeholder="Selecione a categoria" />
            <ComboboxContent>
              <ComboboxEmpty>Não encontramos as categorias</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FieldDescription>
            Selecione a categoria que mais se encaixa
          </FieldDescription>
        </Field>
        <Button type="submit" form="form-register" disabled={loading}>
          {loading ? "Adicionando..." : "Finalizar"}
        </Button>
      </form>
    </div>
  );
}
