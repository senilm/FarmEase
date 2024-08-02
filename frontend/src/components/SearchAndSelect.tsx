import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { SearchAndSelectI, optionT } from "../lib/interfaces";

const SearchAndSelect: React.FC<SearchAndSelectI> = ({ onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<optionT | null>(null);
  const [options, setOptions] = useState<optionT[]>([]);
  const [loading, setLoading] = useState(false);
  const isSelecting = useRef(false);

  useEffect(() => {
    const fetchOptions = async () => {
      if (searchTerm.trim() === "" || isSelecting.current) {
        isSelecting.current = false;
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users?searchTerm=${searchTerm}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setOptions(data.users);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchOptions, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  const handleOptionSelect = (option: optionT) => {
    setSelectedOption(option);
    setSearchTerm(option.name);
    onChange(option);
    setOptions([]); 
    isSelecting.current = true; 
  };

  return (
    <div className="relative max-w-[15rem]">
      <Input
        type="text"
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full focus:ring-0 rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none"
      />
      {loading && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-input bg-background shadow-lg">
          <p className="p-3 text-sm">Loading...</p>
        </div>
      )}
      {options?.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-input bg-background shadow-lg ">
          <ul className="max-h-56 overflow-auto py-1">
            {options.map((option) => (
              <li
                key={option.id}
                className={`cursor-pointer px-4 py-2 hover:bg-muted ${
                  selectedOption?.id === option.id ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchAndSelect;
