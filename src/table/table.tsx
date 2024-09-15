import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";

interface ArtworkThumbnail {
  lqip: string;
  width: number;
  height: number;
  alt_text: string;
}

interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  thumbnail: ArtworkThumbnail;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
  next_url: string | null;
}

interface ApiResponse {
  data: Artwork[];
  pagination: Pagination;
}

const ArtworksComponent: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const op = useRef<OverlayPanel>(null);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [selectRows, setSelectRows] = useState<number>(0);
  const [checkRows, setChecktRows] = useState<number>(0);
  const [blackList, setBlackList] = useState<number[]>([]);

  const fetchArtworks = async (page: number) => {
    try {
      setLoading(true);
      const url = `https://api.artic.edu/api/v1/artworks?page=${page}`;
      const response = await axios.get<ApiResponse>(url);
      const { data, pagination } = response.data;

      setArtworks(data); // Set the artwork data
      setPagination(pagination);
    } catch (error) {
      setError("Failed to fetch artworks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  useEffect(() => {
    const pages = checkRows / 12;
    const currentPage = pagination?.current_page;

    if (currentPage && !blackList.includes(currentPage)) {
      setBlackList((prevList) => {
        if (!prevList.includes(currentPage)) {
          return [...prevList, currentPage];
        }
        return prevList;
      });
      if (currentPage <= pages) {
        const newSelectedArtworks = artworks.slice(0, 12);
        setSelectedArtworks((prevSelected) => [
          ...prevSelected,
          ...newSelectedArtworks,
        ]);
      } else if (currentPage <= pages + 1) {
        const rowstoSelect = checkRows % 12;

        const newSelectedArtworks = artworks.slice(0, rowstoSelect);
        setSelectedArtworks((prevSelected) => [
          ...prevSelected,
          ...newSelectedArtworks,
        ]);
      }
    }
  }, [pagination?.current_page, checkRows, artworks]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= (pagination?.total_pages ?? 1)) {
      setPage(pageNumber);
    }
  };

  const generatePageButtons = () => {
    if (!pagination) return null;

    const { current_page, total_pages } = pagination;
    const range = 4;

    let start = Math.max(1, current_page - range);
    let end = Math.min(total_pages, current_page + range);

    if (current_page - start < range / 2) {
      end = Math.min(total_pages, end + (range / 2 - (current_page - start)));
    }

    if (end - current_page < range / 2) {
      start = Math.max(1, start - (range / 2 - (end - current_page)));
    }

    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="page-numbers">
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={page === pageNumber ? "active" : ""}
            label={String(pageNumber)}
          />
        ))}
      </div>
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 0) {
      setSelectRows(value);
    }
  };

  const handleButtonClick = () => {
    setChecktRows(selectRows);
    setBlackList([]);
    if (checkRows <= 12) {
      const newSelectedArtworks = artworks.slice(0, checkRows);
      setSelectedArtworks(() => [
        ...newSelectedArtworks,
      ]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Artworks</h1>
      <OverlayPanel ref={op}>
        <input
          type="number"
          min="0"
          onChange={handleInputChange}
          style={{ height: "2rem" }}
        />
        <br />
        <Button
          onClick={handleButtonClick}
          label="Select"
          style={{ display: "block", margin: "0 auto" }}
        />
      </OverlayPanel>
      <div className="card">
        <DataTable
          value={artworks}
          showGridlines
          selectionMode="multiple"
          selection={selectedArtworks}
          onSelectionChange={(e) => setSelectedArtworks(e.value)}
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            field="title"
            header={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="button"
                  label="&#709;"
                  onClick={(e) => op.current?.toggle(e)}
                  style={{ all: "unset", cursor: "pointer" }}
                />
                <span style={{ marginLeft: "0.5rem" }}>Title</span>
              </div>
            }
            body={(rowData) => rowData.title}
          />
          <Column field="artist_display" header="Artist Display" />
          <Column field="inscriptions" header="Inscriptions" />
          <Column field="date_start" header="Date Start" />
          <Column field="date_end" header="Date End" />
        </DataTable>

        <div className="pagination-controls">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            label="<"
          />
          {generatePageButtons()}
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination?.total_pages}
            label=">"
          />
        </div>
      </div>
    </div>
  );
};

export default ArtworksComponent;
