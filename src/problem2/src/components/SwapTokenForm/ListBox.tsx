import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Currency } from '../../types/SwapToken';

type Props = {
  label: string;
  options: Currency[];
  placeholder?: string;
  defaultValue?: Currency;
  value: Currency;
  onChange: (value: Currency) => void;
};

const SelectTokenInput = ({
  label,
  options,
  defaultValue,
  value,
  onChange,
  placeholder,
}: Props) => {
  // Render selected value or placeholder
  const renderSelectedValue = () => {
    if (value?.currency) {
      return (
        <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
          <img
            alt=""
            src={value.logo}
            className="size-5 shrink-0 rounded-full"
          />
          <span className="block truncate">{value.currency}</span>
        </span>
      );
    }
    return (
      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
        <span className="block truncate">{placeholder || 'Select'}</span>
      </span>
    );
  };

  // Render options list
  const renderOptions = () => {
    return options.map((item) => (
      <ListboxOption
        key={item.currency}
        value={item}
        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
      >
        <div className="flex items-center">
          <img alt="" src={item.logo} className="size-5 shrink-0 rounded-full" />
          <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
            {item.currency}
          </span>
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
          <CheckIcon aria-hidden="true" className="size-5" />
        </span>
      </ListboxOption>
    ));
  };

  return (
    <Listbox value={value} onChange={onChange} defaultValue={defaultValue}>
      <Label className="block text-sm/6 font-medium text-gray-900">{label}</Label>
      <div className="relative mt-2">
        {/* Listbox Button */}
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
          {renderSelectedValue()}
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        {/* Listbox Options */}
        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {renderOptions()}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default SelectTokenInput;
