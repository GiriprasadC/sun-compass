import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { submitEnquiry } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email address").max(160),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});
type FormValues = z.infer<typeof schema>;

export function EnquiryForm() {
  const [sent, setSent] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: FormValues) => submitEnquiry({ data: values }),
    onSuccess: () => {
      setSent(true);
      queryClient.invalidateQueries({ queryKey: ["dbData"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync(values);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full flex-col items-center justify-center rounded-3xl border border-primary/30 bg-primary-tint/60 p-10 text-center shadow-soft"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-foreground">Thank you</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We have received your enquiry and will contact you shortly.
        </p>
      </motion.div>
    );
  }

  const field = "w-full rounded-xl border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
  const errText = "mt-1.5 text-xs font-medium text-destructive";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-border bg-white p-7 shadow-soft"
      noValidate
    >
      <h3 className="font-display text-xl font-bold text-foreground">Send an enquiry</h3>
      <p className="mt-1 text-sm text-muted-foreground">We'll get back to you within one business day.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            className={cn(field, errors.name ? "border-destructive" : "border-border")}
            {...register("name")}
          />
          {errors.name && <p id="err-name" className={errText}>{errors.name.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">Phone</label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "err-phone" : undefined}
              className={cn(field, errors.phone ? "border-destructive" : "border-border")}
              {...register("phone")}
            />
            {errors.phone && <p id="err-phone" className={errText}>{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
              className={cn(field, errors.email ? "border-destructive" : "border-border")}
              {...register("email")}
            />
            {errors.email && <p id="err-email" className={errText}>{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">Message</label>
          <textarea
            id="message"
            rows={5}
            placeholder="How can we help?"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "err-message" : undefined}
            className={cn(field, "resize-y", errors.message ? "border-destructive" : "border-border")}
            {...register("message")}
          />
          {errors.message && <p id="err-message" className={errText}>{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-hover hover:shadow-elevated disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Enquiry
            </>
          )}
        </button>
      </div>
    </form>
  );
}
