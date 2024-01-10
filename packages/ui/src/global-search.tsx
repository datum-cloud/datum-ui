'use client'

import Image from 'next/image'
import SimpleForm from './simple-form'
import searchIcon from './assets/search-outline-white.svg'

export const GlobalSearch = () => {
  return (
    <SimpleForm
      classNames="ui-relative ui-flex ui-items-center ui-ml-auto ui-mr-11"
      action="#"
      method="GET"
      onSubmit={(e: any) => console.log(e)}
    >
      <label htmlFor="search-field" className="sr-only">
        Search
      </label>
      <div className="!ui-flex !ui-items-center !ui-w-56 !ui-px-4 !ui-py-2 !ui-border !ui-rounded !ui-border-white">
        <Image
          alt="search icon"
          src={searchIcon}
          className="!ui-w-5 !ui-h-5 !ui-mr-2.5"
        />
        <input
          id="search-field"
          className="!ui-block !h-full !ui-w-full !ui-border-0 !ui-py-0 !ui-pl-0 !ui-pr-0 placeholder:!ui-text-white
					focus:!ui-border-0 focus:!ui-ring-0 !ui-text-sm !ui-bg-transparent !ui-text-white !rounded border border-[#D5D1DC]"
          placeholder="Global search"
          type="search"
          name="search"
        />
      </div>
    </SimpleForm>
  )
}

export default GlobalSearch
