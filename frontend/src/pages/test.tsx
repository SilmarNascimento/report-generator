import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function Test() {

  // const fileSchema = z
  //   .custom<File>(val => val instanceof File, 'Please upload a file')

  const fileListSchema = z
    .instanceof(FileList)
    .optional();

  const formSchema = z.object({
    inputFile: fileListSchema
  })

  const { register, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function handleForm(data: z.infer<typeof formSchema>) {
    console.log("Dados recebidos do form: ", data);
  }

  if (formState?.errors) {
    console.log("formState errors: ", formState.errors);
  }

   function handleChange(event) {
    event.preventDefault();
    console.log("Elemento do evento: ", event.target);
    const files = event.target.files;
    console.log("Conteúdo do elemento file", Array.from(files));
    console.log("Quantidade de arquivos: ", files.length);
    console.log("Primeiro arquivo: ", files[0]);
  }
  
  return (
    <>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit(handleForm)}>
        <div>
          <label htmlFor="file">Choose file to upload</label>
          <input
            type="file"
            {...register('inputFile')}
            id="file"
            name="file"
            multiple
            hidden 
            accept="image/*,.pdf"
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}