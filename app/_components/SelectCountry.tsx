import { getCountries } from '@/app/_lib/apiCabins';

interface SelectCountryProps {
  defaultCountry: string;
  name: string;
  id: string;
  className?: string;
}

type Country = {
  name: string;
  flag: string;
};

async function SelectCountry({ defaultCountry, name, id, className }: SelectCountryProps) {
  const countries: Country[] = await getCountries();
  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? '';

  return (
    <select
      name={name}
      id={id}
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value=''>Select country...</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
