import { Button } from "@/app/components/ui/button";
import {
    Command,
    CommandInput,
    CommandList,
} from "@/app/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/components/ui/popover";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { Search } from "lucide-react";
import AssetSearchItem from "./AssetSearchItem";
import { useEffect, useState } from "react";
import { useAssetSearch } from "./useAssetSearch";
import { Skeleton } from "@/app/components/ui/skeleton";

const AssetSearch = () => {
    const [searchValue, setSearchValue] = useState("");

    const debouncedSearchValue = useDebouncedValue(searchValue, {
        wait: 500,
    })[0];

    const {
        searchResults,
        isSearching,
        search,
        resetSearch,
        searchStatus,
        isNoResultsFound,
    } = useAssetSearch(debouncedSearchValue);

    useEffect(() => {
        if (debouncedSearchValue.length > 0) {
            search();
        }
    }, [debouncedSearchValue, search]);

    return (
        <Popover
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSearchValue("");
                    resetSearch();
                }
            }}
        >
            <PopoverTrigger asChild>
                <Button variant="secondary">
                    <span className="flex items-center gap-2">
                        <Search size={16} />
                        Search
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="bg-primary-lightest rounded-xl border border-primary-dark mt-6"
                align="end"
            >
                <Command>
                    <CommandInput
                        placeholder="Search for an asset..."
                        value={searchValue}
                        onValueChange={(searchValue) =>
                            setSearchValue(searchValue)
                        }
                    />
                    {searchStatus != "idle" && (
                        <CommandList className="p-1 gap-y-1.5">
                            {isSearching ? (
                                <div
                                    className="flex flex-col gap-2"
                                    data-testid="loading-state"
                                >
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Skeleton
                                                key={index}
                                                className="w-full h-10 rounded-xl"
                                            />
                                        ),
                                    )}
                                </div>
                            ) : (
                                searchResults?.map((asset) => (
                                    <AssetSearchItem
                                        key={`${asset.symbol}-${asset.name}`}
                                        asset={asset}
                                    />
                                ))
                            )}
                            {isNoResultsFound && (
                                <div className="p-2 text-center text-base font-sans text-primary-dark">
                                    No assets found.
                                </div>
                            )}
                        </CommandList>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default AssetSearch;
