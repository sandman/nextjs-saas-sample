'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',

  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};


export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
}

const ProperyFormSchema = z.object({
    id: z.string(),
    title: z.string(),
    address: z.string(),
    imageUrl: z.string(),
    monthlyRent: z.coerce.number(),
    tenants: z.coerce.number(),
    lettingStatus: z.string(),
    complianceStatus: z.enum(['pending', 'complete']),
    });

const CreateProperty = ProperyFormSchema.omit({ id: true });

export async function createProperty(formData: FormData) {
    const { title, address, imageUrl, monthlyRent, tenants, lettingStatus, complianceStatus } = CreateProperty.parse({
    title: formData.get('title'),
    address: formData.get('address'),
    imageUrl: formData.get('imageUrl'),
    monthlyRent: formData.get('monthlyRent'),
    tenants: formData.get('tenants'),
    lettingStatus: formData.get('lettingStatus'),
    complianceStatus: formData.get('complianceStatus'),
    });
    await sql`
    INSERT INTO properties (title, address, image_url, monthly_rent, tenants, letting_status, compliance_status)
    VALUES (${title}, ${address}, ${imageUrl}, ${monthlyRent}, ${tenants}, ${lettingStatus}, ${complianceStatus})
    `;
    revalidatePath('/dashboard/properties');
    redirect('/dashboard/properties');

}

const UpdateProperty = ProperyFormSchema.omit({ id: true });

export async function updateProperty(id: string, formData: FormData) {
    const { title, address, imageUrl, monthlyRent, tenants, lettingStatus, complianceStatus } = UpdateProperty.parse({
    title: formData.get('title'),
    address: formData.get('address'),
    imageUrl: formData.get('imageUrl'),
    monthlyRent: formData.get('monthlyRent'),
    tenants: formData.get('tenants'),
    lettingStatus: formData.get('lettingStatus'),
    complianceStatus: formData.get('complianceStatus'),
    });
    await sql`
    UPDATE properties
    SET title = ${title}, address = ${address}, image_url = ${imageUrl}, monthly_rent = ${monthlyRent}, tenants = ${tenants}, letting_status = ${lettingStatus}, compliance_status = ${complianceStatus}
    WHERE id = ${id}
    `;
    revalidatePath('/dashboard/properties');
    redirect('/dashboard/properties');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}