import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from 'next-themes'

import Footer from 'components/Footer/Footer'
import cn from 'lib/classNames'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Container(props: any) {
  const [mounted, setMounted] = useState<boolean>(false)
  const { resolvedTheme, setTheme } = useTheme()

  const { children, ...customMeta } = props
  const router = useRouter()

  const meta = {
    title: 'Template name',
    description: 'Template description',
    image:
      'https://cdn.discordapp.com/attachments/797485737272541250/893912493255176192/UnicornVectorGradient_7.png',
    type: 'website',
    ...customMeta,
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <div
        className={cn(
          'text-primary',
          'relative h-full min-h-screen w-full',
          'flex flex-col',
          'motion-reduce:transition-none motion-reduce:transform-none'
        )}
      >
        <Head>
          <meta name='robots' content='follow, index' />
          <meta
            property='og:url'
            content={`https://template.cretu.dev/${router.asPath}`}
          />
          <link
            rel='canonical'
            href={`https://template.cretu.dev/${router.asPath}`}
          />
          <meta property='og:type' content={meta.type} />
          <meta property='og:site_name' content='Cristian Crețu' />
          <meta property='og:description' content={meta.description} />
          <meta property='og:title' content={meta.title} />
          <meta property='og:image' content={meta.image} />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@cristicrtu' />
          <meta name='twitter:title' content={meta.title} />
          <meta name='twitter:description' content={meta.description} />
          <meta name='twitter:image' content={meta.image} />
          {meta.date && (
            <meta property='article:published_time' content={meta.date} />
          )}
        </Head>

        <main
          className={cn(
            'px-4 mt-12',
            'max-w-3xl',
            'mx-auto my-auto',
            'flex flex-col justify-center gap-12',
            'divide-y divide-gray-200 dark:divide-gray-900',
            'rounded-lg'
          )}
        >
          <div>{children}</div>
          <footer>
            <Footer />
          </footer>
        </main>
      </div>
    </>
  )
}
