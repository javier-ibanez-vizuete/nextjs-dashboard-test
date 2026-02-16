'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FromSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please Select a Customer.",
    }),
    amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than $0." }),
    status: z.enum(["pending", "paid"], {
        invalid_type_error: "Please select an invoice status."
    }),
    date: z.string(),
})

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        state?: string[];
    },
    message?: string | null;
}

const CreateInvoice = FromSchema.omit({ id: true, date: true })


export async function createInvoice(prevState: State, formData: FormData) {
    const validateFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validateFields.success) {
        return { errors: validateFields.error.flatten().fieldErrors, message: "Missing Fields. Failed to Create Invoice." }
    }

    const { customerId, amount, status } = validateFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0];

    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    } catch (error) {
        console.error(error)
        return { message: "Database Error: Failed to Create Invoice" }
    }

    revalidatePath("/dashboard/invoices")
    redirect("/dashboard/invoices")
}

const UpdateInvoice = FromSchema.omit({ id: true, date: true })

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validateFields = UpdateInvoice.safeParse({ customerId: formData.get("customerId"), amount: formData.get("amount"), status: formData.get("status") })

    if (!validateFields.success) {
        return { errors: validateFields.error.flatten().fieldErrors, message: "Missing Fields. Failed to update Invoice." }
    }

    const { customerId, amount, status } = validateFields.data;
    const amoutInCents = amount * 100;

    try {
        await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amoutInCents}, status = ${status}
    WHERE id = ${id}
    `;

    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to Update Invoice" }
    }

    revalidatePath("/dashboard/invoices")
    redirect("/dashboard/invoices")
}

export async function deleteInvoice(id: string) {
    throw new Error("Failed to Delete Invoice")
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath("/dashboard/invoices")
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to Delete Invoice" }
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials";
                default:
                    return "Something went wrong";
            }
        }
        throw error
    }
}