import { X, Check, Loader2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/shadcn/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthContext";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Minimum 3 characters." }),
  password: z.string().min(5, { message: "Minimum 5 characters." }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      await login(data);
      navigate("/mock-exams");
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="username">
          Username
        </label>
        <input
          {...register("username")}
          id="username"
          type="text"
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        {errors.username && (
          <p className="text-sm text-red-400">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="password">
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 w-full text-sm"
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" onClick={() => navigate(-1)}>
          <X className="size-3" />
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          className="bg-teal-400 text-teal-950"
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
          Login
        </Button>
      </div>
    </form>
  );
}
