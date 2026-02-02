"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <main className='flex justify-center items-center flex-col gap-6'>
      <h1 className='text-3xl font-semibold'>Something went wrong!</h1>
      <p className='text-lg'>{error.message}</p>
      <p
        className='inline-block bg-accent-300 text-primary-800 px-6 py-3 text-lg rounded'>
        Try again
      </p>
    </main>
  );
}
