'use client'

import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog, Transition, Disclosure } from '@headlessui/react'
import { clsx } from 'clsx'
import logo from './assets/icon_logo.svg'
import chevronRight from './assets/chevron-right.svg'
import bars from './assets/horizonal-bars.svg'
import arrowRight from './assets/arrow-right.svg'

export const Drawer = ({ routes, currentPath }: any) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tabletMenuOpen, setTabletMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        /**
         * Window is going into mobile mode
         */
        if (window.innerWidth < 1024) {
          setIsMobile(true)
          /**
           * If user has tablet menu open when playing with window
           * size or rotating device, retain the open menu state
           */
          if (tabletMenuOpen) {
            setMobileMenuOpen(true)
            setTabletMenuOpen(false)
          }
        }
        /**
         * Window is going into tablet mode
         */
        if (window.innerWidth >= 1024) {
          setIsMobile(false)
          /**
           * If user has mobile menu open when playing with window
           * size or rotating device, retain the open menu state
           */
          if (mobileMenuOpen) {
            setMobileMenuOpen(false)
            setTabletMenuOpen(true)
          }
        }
      }

      window.addEventListener('resize', handleResize)
      handleResize()

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [mobileMenuOpen, tabletMenuOpen])

  routes.map((route: any) => {
    route.current = false

    if (route.children) {
      route.current = pathname.includes(route.href)

      route.children.map((childRoute: any) => {
        childRoute.current = false
        childRoute.current = pathname === childRoute.href
      })
    }

    if (route.detail) {
      route.current = pathname.includes(route.href)
    }

    if (!route.children || !route.detail) {
      route.current = route.href === pathname
    }
  })

  return (
    <>
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="ui-relative lg:ui-hidden ui-z-50 ui-ease-in-out"
          onClose={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Transition.Child
            as={Fragment}
            enter="ui-transition-opacity ui-ease-linear ui-duration-300"
            enterFrom="ui-opacity-0"
            enterTo="ui-opacity-100"
            leave="ui-transition-opacity ui-ease-linear ui-duration-300"
            leaveFrom="ui-opacity-100"
            leaveTo="ui-opacity-0"
          >
            <div className="2xl:ui-hidden ui-fixed ui-inset-0 ui-bg-blackberry-200/70 dark:ui-bg-peat-900/80" />
          </Transition.Child>

          <div className="ui-fixed ui-inset-0 ui-flex">
            <Transition.Child
              as={Fragment}
              enter="ui-transition ui-ease-in-out ui-duration-300 ui-transform"
              enterFrom="-ui-translate-x-full"
              enterTo="ui-translate-x-0"
              leave="ui-transition ui-ease-in-out ui-duration-300 ui-transform"
              leaveFrom="ui-translate-x-0"
              leaveTo="-ui-translate-x-full"
            >
              <Dialog.Panel>
                <div className="!ui-w-72 !ui-h-full !ui-top-16 !ui-inset-y-0 !ui-z-30 !ui-flex !ui-flex-col ui-bg-white dark:ui-bg-peat-800 ui-border-0 ui-border-r ui-border-blackberry-200 dark:ui-border-peat-700">
                  <div className="ui-flex ui-grow ui-flex-col ui-gap-y-5 ui-overflow-y-auto">
                    <nav className="ui-flex ui-flex-1 ui-flex-col ui-px-6 ui-py-4 ui-mb-8">
                      <ul className="ui-flex ui-flex-1 ui-flex-col ui-space-y-1 ui-overflow-y-scroll ui-overflow-x-clip">
                        {routes.map((item: any, idx: number) =>
                          item.name !== '_divider' ? (
                            <li key={idx}>
                              {!item.children ? (
                                <Link
                                  key={idx}
                                  className={clsx(
                                    item.current
                                      ? 'ui-bg-blackberry-50 dark:ui-bg-peat-700'
                                      : 'hover:ui-bg-blackberry-100 hover:dark:ui-bg-peat-900 hover:dark:ui-text-blackberry-100',
                                    '!ui-group !ui-flex !ui-items-center !ui-gap-x-3 !ui-rounded-md !ui-p-2 !ui-text-sm !ui-leading-6 !ui-transition-all !ui-ease-in-out',
                                  )}
                                  href={item.href}
                                >
                                  <Image
                                    alt={`${item.name} icon`}
                                    aria-hidden="true"
                                    className="!ui-h-4 !ui-w-4 !ui-shrink-0"
                                    src={item.icon}
                                  />
                                  {item.name}
                                </Link>
                              ) : (
                                <Disclosure as="div" key={`${idx}_parent`}>
                                  {({ open }) => (
                                    <>
                                      <Disclosure.Button
                                        className={clsx(
                                          item.current
                                            ? 'ui-bg-blackberry-50 dark:ui-bg-peat-700'
                                            : 'hover:ui-bg-blackberry-100 hover:dark:ui-bg-peat-900 hover:ui-dark:text-blackberry-100',
                                          '!ui-group !ui-flex !ui-w-full !ui-items-center !ui-gap-x-3 !ui-rounded-md !ui-p-2 !ui-text-sm !ui-leading-6 !ui-transition-all !ui-ease-in-out',
                                        )}
                                      >
                                        <Image
                                          alt={`${item.name} icon`}
                                          aria-hidden="true"
                                          className="ui-h-auto ui-w-auto"
                                          src={item.icon}
                                        />
                                        {item.name}
                                        <Image
                                          src={chevronRight}
                                          alt="open close chevron icon"
                                          className={clsx(
                                            open ? '!ui-rotate-90' : null,
                                            '!ui-ml-auto !ui-w-3',
                                          )}
                                          aria-hidden="true"
                                        />
                                      </Disclosure.Button>
                                      <Disclosure.Panel
                                        as="ul"
                                        className="!ui-mt-1 !ui-pl-6"
                                      >
                                        {item?.children.map(
                                          (child: any, cdx: number) => (
                                            <li key={`${idx}_${cdx}_child`}>
                                              <Disclosure.Button
                                                as="a"
                                                href={child.href}
                                                className={clsx(
                                                  child.current
                                                    ? 'ui-bg-blackberry-50 dark:ui-bg-peat-700'
                                                    : 'hover:ui-bg-blackberry-100 hover:dark:ui-bg-peat-900 hover:dark:ui-text-blackberry-100',
                                                  '!ui-group !ui-flex !ui-items-center !ui-gap-x-3 !ui-rounded-md !ui-p-2 !ui-text-sm !ui-leading-6 !ui-transition-all !ui-ease-in-out',
                                                )}
                                              >
                                                {child.name}
                                              </Disclosure.Button>
                                            </li>
                                          ),
                                        )}
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                              )}
                            </li>
                          ) : (
                            <li key={`${idx}_divider`}>
                              <div className="!ui-h-0 !ui-border-t !ui-w-72 !ui-border-blackberry-200 dark:!ui-border-peat-700 -!ui-ml-6 !ui-my-6"></div>
                            </li>
                          ),
                        )}
                      </ul>
                    </nav>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div
        className={clsx(
          tabletMenuOpen ? '!ui-w-72' : 'ui-w-16 2xl:ui-w-72',
          'ui-hidden ui-z-50 lg:ui-flex ui-fixed ui-top-16 ui-h-[calc(100%-4rem)] ui-flex-col ui-bg-white dark:ui-bg-peat-800 ui-border-0 ui-border-r ui-border-blackberry-200 dark:ui-border-peat-700 ui-transition-all ui-ease-in-out',
        )}
      >
        <div className="ui-flex ui-grow ui-flex-col ui-gap-y-5 ui-overflow-y-auto">
          <nav
            className={clsx(
              tabletMenuOpen ? '!ui-px-6' : null,
              'ui-flex ui-flex-1 ui-flex-col ui-px-2 2xl:ui-px-6 ui-py-4 ui-mb-8',
            )}
          >
            <ul className="!ui-flex !ui-flex-1 !ui-flex-col !ui-space-y-1 !ui-overflow-y-scroll !ui-overflow-x-clip">
              {routes.map((item: any, idx: number) =>
                item.name !== '_divider' ? (
                  <li key={idx}>
                    {!item.children ? (
                      <Link
                        key={idx}
                        className={clsx(
                          item.current
                            ? 'ui-bg-blackberry-50 dark:ui-bg-peat-700'
                            : 'hover:ui-bg-blackberry-100 hover:dark:ui-bg-peat-900 hover:dark:ui-text-blackberry-100',
                          tabletMenuOpen ? '!ui-justify-start' : '',
                          'ui-group ui-flex ui-justify-center 2xl:ui-justify-start !ui-items-center !ui-gap-x-3 !ui-rounded-md !ui-p-2 !ui-text-sm !ui-leading-6!ui-transition-all !ui-ease-in-out',
                        )}
                        href={item.href}
                      >
                        <Image
                          alt={`${item.name} icon`}
                          aria-hidden="true"
                          className="ui-h-4 ui-w-4"
                          src={item.icon}
                        />
                        <span
                          className={clsx(
                            tabletMenuOpen ? '!ui-flex' : null,
                            'ui-hidden 2xl:ui-inline-flex',
                          )}
                        >
                          {item.name}
                        </span>
                      </Link>
                    ) : (
                      <Disclosure as="div" key={`${idx}_parent`}>
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={clsx(
                                item.current
                                  ? 'ui-bg-blackberry-50 dark:ui-bg-peat-700'
                                  : 'hover:ui-bg-blackberry-100 hover:dark:ui-bg-peat-900 hover:dark:ui-text-blackberry-100',
                                tabletMenuOpen ? '!ui-flex' : null,
                                'ui-group ui-hidden 2xl:ui-flex !ui-justify-center !ui-items-center !ui-w-full !ui-gap-x-3 !ui-rounded-md !ui-p-2 !ui-text-sm !ui-leading-6 !ui-transition-all !ui-ease-in-out',
                              )}
                            >
                              <Image
                                alt={`${item.name} icon`}
                                aria-hidden="true"
                                className="ui-h-auto  ui-w-auto"
                                src={item.icon}
                              />
                              <span
                                className={clsx(
                                  tabletMenuOpen ? '!ui-flex' : null,
                                  'ui-hidden 2xl:ui-inline-flex',
                                )}
                              >
                                {item.name}
                              </span>
                              <Image
                                src={chevronRight}
                                alt="open close chevron icon"
                                className={clsx(
                                  open ? '!ui-rotate-90' : null,
                                  tabletMenuOpen ? '!ui-flex' : null,
                                  'ui-ml-auto ui-w-3 ui-hidden 2xl:ui-flex',
                                )}
                                aria-hidden="true"
                              />
                            </Disclosure.Button>
                            <Link
                              className={clsx(
                                item.current
                                  ? 'ui-bg-blackberry-50 dark:ui-bg-peat-700'
                                  : 'hover:!ui-bg-blackberry-100 hover:dark:!ui-bg-peat-900 hover:dark:!ui-text-blackberry-100',
                                tabletMenuOpen ? '!ui-hidden' : null,
                                'ui-group ui-flex 2xl:ui-hidden ui-justify-center !ui-gap-x-3 !ui-rounded-md !ui-p-2 !ui-text-sm !ui-leading-6 !ui-transition-all !ui-ease-in-out',
                              )}
                              href={item?.children[0].href}
                            >
                              <Image
                                alt={`${item.name} icon`}
                                aria-hidden="true"
                                className="!ui-h-4 !ui-w-4 !ui-shrink-0"
                                src={item.icon}
                              />
                            </Link>
                            <Disclosure.Panel
                              as="ul"
                              className={clsx(
                                tabletMenuOpen && open ? '!ui-flex' : null,
                                tabletMenuOpen ? '!ui-flex' : null,
                                '!ui-flex-col !ui-mt-1 !ui-pl-7 ui-hidden 2xl:ui-flex',
                              )}
                            >
                              {item?.children.map((child: any, cdx: number) => (
                                <li key={`${idx}_${cdx}_child`}>
                                  <Disclosure.Button
                                    as="a"
                                    href={child.href}
                                    className={clsx(
                                      child.current
                                        ? 'ui-bg-blackberry-50 dark:ui-bg-peat-700'
                                        : 'hover:ui-bg-blackberry-100 hover:dark:ui-bg-peat-900 hover:dark:ui-text-blackberry-100',
                                      'ui-group ui-flex ui-items-center !ui-gap-x-3 ui-rounded-md ui-p-2 ui-text-sm ui-leading-6 ui-transition-all ui-ease-in-out',
                                    )}
                                  >
                                    {child.name}
                                  </Disclosure.Button>
                                </li>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                  </li>
                ) : (
                  <li key={`${idx}_divider`}>
                    <div className="!ui-h-0 !ui-border-t !ui-w-72 !ui-border-blackberry-200 dark:!ui-border-peat-700 -!ui-ml-6 !ui-my-6"></div>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      </div>

      <button
        className={clsx(
          tabletMenuOpen && !isMobile ? '!ui-left-72' : null,
          `ui-left-0 lg:ui-left-16 2xl:ui-hidden ui-flex !ui-items-center !ui-px-4 !ui-py-3 !ui-min-w-14 !ui-fixed !ui-bottom-0 !ui-rounded-tr ui-bg-white dark:ui-bg-peat-400 !ui-border-t !ui-border-r ui-border-blackberry-100 dark:ui-border-peat-700 !ui-z-50`,
        )}
        onClick={() => {
          if (window.innerWidth < 1023) {
            setMobileMenuOpen(!mobileMenuOpen)
          }

          if (window.innerWidth >= 1024) {
            setTabletMenuOpen(!tabletMenuOpen)
          }
        }}
        type="button"
      >
        <Image
          alt="menu icon icon"
          aria-hidden="true"
          className="!ui-h-4 !ui-w-4 !ui-shrink-0"
          src={bars}
        />
        <Image
          alt="open close chevron icon"
          aria-hidden="true"
          className={clsx(
            tabletMenuOpen && !isMobile
              ? '!-ui-rotate-180'
              : '!ui-rotate-0 2xl:!ui-rotate-180',
            '!ui-ml-2 !ui-w-4 !ui-transition-all !ui-ease-in-out',
          )}
          src={arrowRight}
        />
      </button>
    </>
  )
}

export default Drawer
