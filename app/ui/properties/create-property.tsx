'use client';

import React, { useState } from "react";
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createProperty } from '@/app/lib/actions';
import CustomFileSelector from '@/app/ui/properties/CustomFileSelector';
import ImagePreview from "@/app/ui/properties/ImagePreview";
import axios from 'axios';

export default function PropertyForm() {

  const [images, setImages] = useState<File[]>([]);
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert `FileList` to `File[]`
      const _files = Array.from(e.target.files);
      setImages(_files);
    }
  };

  return (
    <form action={createProperty}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
            {/* Property Title */}
            <div className="mb-4">
                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                    Property Title
                </label>
                <div className="relative mt-2 rounded-md">
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Enter Property Title"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                </div>
            </div>

            {/* Property Description */}
            <div className="mb-4">
                <label htmlFor="description" className="mb-2 block text-sm font-medium">
                    Property Description
                </label>
                <div className="relative mt-2 rounded-md">
                        <input
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Enter Property Description"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                </div>
            </div>

            {/* Property Address */}
            <div className="mb-4">
                <label htmlFor="address" className="mb-2 block text-sm font-medium">
                    Property Address
                </label>
                <div className="relative mt-2 rounded-md">
                        <input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Enter Property Address"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                </div>
            </div>

            {/* Property Image URL */}
            <div className="mb-4">
                <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
                    Property Image URL
                </label>
                <div className="relative mt-2 rounded-md">
                    <CustomFileSelector
                        accept="image/png, image/jpeg"
                        onChange={handleFileSelected}
                    />
                    <button
                        type="submit"
                        className="bg-violet-50 text-violet-500 hover:bg-violet-100 px-4 py-2 rounded-md"
                    >
                        Upload
                    </button>
                    <ImagePreview images={images} />
                </div>
            </div>

            {/* Property Monthly Rent */}
            <div className="mb-4">
                <label htmlFor="monthly_rent" className="mb-2 block text-sm font-medium">
                    Property Monthly Rent
                </label>
                <div className="relative mt-2 rounded-md">
                        <input
                            id="monthly_rent"
                            name="monthly_rent"
                            type="number"
                            placeholder="Enter Property Monthly Rent"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                </div>
            </div>

            {/* Property Number of Tenants */}
            <div className="mb-4">
                <label htmlFor="tenants" className="mb-2 block text-sm font-medium">
                    Property Number of Tenants
                </label>
                <div className="relative mt-2 rounded-md">
                        <input
                            id="tenants"
                            name="tenants"
                            type="number"
                            placeholder="Enter Property Number of Tenants"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                </div>
            </div>

            {/* Property lettingStatus */}
            <fieldset>
            <legend className="mb-2 block text-sm font-medium">
                What is the current property letting status?
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                <div className="flex gap-4">
                <div className="flex items-center">
                    <input
                    id="propertyStatusLet"
                    name="lettingStatus"
                    type="radio"
                    value="true"
                    checked
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    /* onChange={handleLettingStatusChange} */
                    />
                    <label
                    htmlFor="yes"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-black"
                    >
                    Let <CheckIcon className="h-4 w-4" />
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                    id="propertyStatusLetNo"
                    name="lettingStatus"
                    type="radio"
                    value="true"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    />
                    <label
                    htmlFor="no"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-medium text-black"
                    >
                    Not let <ClockIcon className="h-4 w-4" />
                    </label>
                </div>
                </div>
            </div>
            </fieldset>

            {/* Property Compliance Status */}
           <fieldset>
            <legend className="mb-2 block text-sm font-medium">
                What is the current compliance status?
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                <div className="flex gap-4">
                <div className="flex items-center">
                    <input
                    id="complianceStatusComplete"
                    name="complianceStatus"
                    type="radio"
                    value="complete"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-white focus:ring-2"
                    />
                    <label
                    htmlFor="complete"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-black"
                    >
                    Complete <CheckIcon className="h-4 w-4" />
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                    id="complianceStatusPending"
                    name="complianceStatus"
                    type="radio"
                    value="pending"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    />
                    <label
                    htmlFor="pending"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-medium text-black"
                    >
                    Pending <ClockIcon className="h-4 w-4" />
                    </label>
                </div>
                </div>
            </div>
            </fieldset>
        </div>
        <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Property</Button>
      </div>
    </form>
  );
}