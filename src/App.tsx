import './App.css';
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import type { Artwork } from './interfaces/Artwork'; 


const App = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rows] = useState<number>(12); 
    
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);

    const op = useRef<OverlayPanel>(null);
    const [numToSelect, setNumToSelect] = useState<number>(0);

    const fetchArtworks = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`);
            const data = await response.json();
            
            setArtworks(data.data); 
            setTotalRecords(data.pagination.total);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    // Effect to fetch data whenever the 'page' state changes
    useEffect(() => {
        fetchArtworks(page);
    }, [page]);
    
    const onPageChange = (event: any) => {
        const newPage = Math.floor(event.first / rows) + 1;
        setPage(newPage);
    };

    
    const handleCustomSelection = async () => {
        // Hide the overlay panel
        op.current?.hide();
        
        if (numToSelect <= 0) {
            return;
        }

        setLoading(true);

        const newSelectedArtworks: Artwork[] = [];
        let remainingToSelect = numToSelect;
        let currentPage = page;

        // Loop to fetch pages and select rows until the number is met.
        while (remainingToSelect > 0) {
            try {
                const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${currentPage}`);
                const data = await response.json();
                const fetchedArtworks = data.data as Artwork[];
                
                const numToTake = Math.min(remainingToSelect, fetchedArtworks.length);
                const selectedOnPage = fetchedArtworks.slice(0, numToTake);
                newSelectedArtworks.push(...selectedOnPage);
                
                remainingToSelect -= numToTake;
                currentPage++;

                // Breaking the loop if we run out of pages
                if (currentPage > data.pagination.total_pages) {
                    break;
                }
            } catch (error) {
                console.error("Error fetching data for selection:", error);
                break;
            }
        }
        
        // Merge with existing selections and remove duplicates by ID
        const mergedSelectionMap = new Map();
        [...selectedArtworks, ...newSelectedArtworks].forEach(artwork => {
            if (artwork.id) {
                mergedSelectionMap.set(artwork.id, artwork);
            }
        });

        setSelectedArtworks(Array.from(mergedSelectionMap.values()));
        setLoading(false);
    };
    
    // Custom header template for the selection column
    const selectionHeaderTemplate = (options: any) => {
        return (
            <div className="flex items-center justify-center gap-1">
                {/* The standard checkbox for select/deselect all on the current page */}
                <div onClick={(event) => options.onColumnToggleAll(event)} className="cursor-pointer">
                    {options.allRowsSelected ? (
                        <i className="pi pi-check-square" />
                    ) : (
                        <i className="pi pi-square" />
                    )}
                </div>

                {/* The down arrow icon that will open the overlay panel */}
                <i 
                    className="pi pi-angle-down cursor-pointer" 
                    onClick={(e) => op.current?.toggle(e)} 
                />
            </div>
        );
    };

    return (
        <div className='min-h-screen w-[100vw] flex items-center justify-center bg-white'>
            <DataTable 
                value={artworks} 
                paginator 
                rows={rows} 
                totalRecords={totalRecords}
                lazy 
                onPage={onPageChange}
                loading={loading}
                selectionMode="multiple"
                selection={selectedArtworks}
                onSelectionChange={(e) => setSelectedArtworks(e.value)}
                dataKey="id" // IMPORTANT: Use a unique key for selection persistence
            >
                <Column 
                    selectionMode="multiple" 
                    headerStyle={{ width: '3em' }}
                    header={selectionHeaderTemplate}
                ></Column>
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist Display" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>
            
            {/* The OverlayPanel component */}
            <OverlayPanel ref={op}>
                <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="num-input" className="text-sm">Select number of rows:</label>
                    <InputNumber 
                        id="num-input" 
                        value={numToSelect} 
                        onValueChange={(e) => setNumToSelect(e.value as number)} 
                        // showButtons 
                        min={0}
                    />
                    <Button 
                        label="Select" 
                        onClick={handleCustomSelection} 
                        className="w-full"
                    />
                </div>
            </OverlayPanel>
        </div>
    );
};

export default App;