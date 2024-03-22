import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function Test() {
  const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

  const fileSchema = z
    .custom<File>(val => val instanceof File, 'Please upload a file')
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 3MB');

  const fileListSchema = z.object({
    length: z.number(),
    item: z.function(), // Método para acessar o arquivo pelo índice
    files: z.array(fileSchema)
  });

  const formSchema = z.object({
    file: fileListSchema,
  });

  function handleChange(event) {
    event.preventDefault();
    console.log(event.target);
    const files = event.target.files;
    console.log(Array.from(files));
    console.log(files.length);
    console.log(files[0]);
  }

  const { register, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(fileListSchema),
  })

  function handleForm(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  if (formState?.errors) {
    console.log(formState.errors);
  }
  
  return (
    <>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit(handleForm)}>
        <div>
          <label htmlFor="file">Choose file to upload</label>
          <input
            type="file"
            {...register("file")}
            id="file"
            name="file"
            multiple
            hidden 
            onChange={handleChange} />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}