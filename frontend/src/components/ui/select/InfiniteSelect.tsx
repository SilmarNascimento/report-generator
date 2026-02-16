import { useState } from 'react'
import { useListenForOutsideClicks } from '../../../hooks/useListenForOutsideClicks'
import { ChevronRight } from 'lucide-react'
import { Loader } from '../loader/Loader'

type SelectOptionProps = {
  label: string
  value: string
}

type SelectProps = {
  options: SelectOptionProps[]
  selected?: SelectOptionProps
  handleSelect: (option: SelectOptionProps) => void
  placeholder?: string
  isFetchingOptions?: boolean
  lastOptionRef: (node: Element | null) => void
}

export function InfiniteSelect({
  options,
  selected = { label: '', value: '' },
  placeholder = 'Select',
  handleSelect,
  isFetchingOptions,
  lastOptionRef
}: SelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  function openDropdown() {
    setIsDropdownOpen(true)
  }

  function closeDropdown() {
    setIsDropdownOpen(false)
  }

  function labelClassName() {
    return `block max-w-full capitalize truncate ${selected?.label ? 'text-zinc-100' : 'text-neutral/400'}`
  }

  function optionClassName(option: SelectOptionProps, index: number, isSelected: boolean) {
    isSelected ||= selected?.value === option.value

    return `active:bg-background-selected-option relative cursor-default select-none py-2 px-4 ${
      options.length - 1 === index ? 'rounded-b-md' : ''
    } ${isSelected ? 'bg-secondary/blue/50' : ''} hover:bg-secondary/blue/50 mb-1 last-of-type:mb-[0] block text-left w-full`
  }

  const containerClassName = () => `
    ${
      isDropdownOpen ? '!border-grey/900' : ''
    } px-4 py-2 flex justify-between items-center rounded w-full font-normal border border-solid border-neutral/200 bg-transparent leading-[20px] text-xs text-grey/900
    `

  const { elementRef } = useListenForOutsideClicks(closeDropdown)

  function renderNoOptions() {
    if (isFetchingOptions) return <Loader />

    return (
      <div className='relative cursor-default select-none py-2 pl-3 pr-9'>
        <span className='font-normal block truncate text-sm text-black'>No options here</span>
      </div>
    )
  }

  function renderOptions(options: SelectOptionProps[]) {
    return options?.length > 0 ? (
      options?.map((option, index) => {
        const isSelected = selected?.value === option.value

        return (
          <button
            type='button'
            key={String(option.value) + String(index)}
            className={optionClassName(option, index, isSelected)}
            onClick={() => {
              handleSelect(option)
              closeDropdown()
            }}
            ref={options?.length - 1 === index ? lastOptionRef : null}
          >
            <span
              title={option.label}
              className={`${
                isSelected ? 'font-semibold ' : 'font-normal'
              } block truncate text-zinc-100 text-[0.625rem] cursor-pointer leading-[0.8rem] font-normal`}
            >
              {option.label}
            </span>
          </button>
        )
      })
    ) : renderNoOptions()
  }

  return (
    <div className='relative grow'>
      <button
        type='button'
        onClick={openDropdown}
        className={containerClassName()}
      >
        <span
          title={selected?.label}
          className={labelClassName()}
        >
          {selected?.label || placeholder}
        </span>
        <span className='pointer-events-none ml-3 flex items-center'>
          <ChevronRight className='rotate-90 text-[#96989A]' />
        </span>
      </button>

      {isDropdownOpen && (
        <div
          className={
            'absolute z-[500] w-full overflow-auto rounded-b-md bg-shades/white py-[14px] text-base ring-opacity-5 focus:outline-none mt-1 max-h-40 '
          }
          style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)' }}
          ref={elementRef}
        >
          {renderOptions(options)}
        </div>
      )}
    </div>
  )
}
