import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useDebounce } from '@uidotdev/usehooks';
import { SavedDecks } from "~/lib/my-components/SavedDecks";



interface SavedDecksProps {
    savedDecks: SavedDeck[];
}


export function SearchbleSavedDecks({ savedDecks }: SavedDecksProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, [setSearchTerm])
    return (
        <>
            <div className="flex flex-row items-center">
                <input type="text" id="search-deck" className={`
                    text-base border-2 py-1 px-2 rounded-md border-gray-200 transition-colors
                        focus:outline-none focus:border-gray-400 w-[80%] mr-1
                `} onChange={handleOnChange} />
                <Search className="text-gray-400" />
            </div>
            <SavedDecks savedDecks={savedDecks?.filter(item => item.title.toLocaleLowerCase().includes(debouncedSearchTerm.toLocaleLowerCase()))} />
        </>
    )
}