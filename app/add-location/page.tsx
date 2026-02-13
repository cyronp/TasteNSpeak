"use client";
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
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="py-4">
        <h1 className="text-2xl font-bold">Adicionar estabelecimento</h1>
        <h2 className="font-semibold text-muted-foreground">
          Realize o cadastro do estabelecimento
        </h2>
      </div>
      <form className="grid grid-cols-1 gap-6" id="form-register">
        <Field>
          <FieldLabel htmlFor="input-field-image">
            Imagem do estabelecimento{" "}
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Input id="input-field-image" type="file" accept="image/*" />
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
            type="text"
            placeholder="Insira o nome do estabelecimento"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-field-description">
            Descrição sobre o estabelecimento (opcional)
          </FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id="input-field-description"
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
          <Combobox items={categorias}>
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
        <Button type="submit" form="form-register">
          Finalizar
        </Button>
      </form>
    </div>
  );
}
