import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface Place {
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface SearchMapProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void; // 모달 닫기
  handleAddress: (place: any) => void;
}

export const SearchMap = ({
  searchValue,
  setSearchValue,
  handleAddress,
  onClose,
}: SearchMapProps) => {
  const [places, setPlaces] = useState<Place[]>([]); // 검색된 장소 리스트
  const [mapCenter, setMapCenter] = useState({
    lat: 37.566826,
    lng: 126.9786567,
  }); // 지도 중심 좌표
  const [showMap, setShowMap] = useState(false); // 지도 표시 여부

  useEffect(() => {
    if (!searchValue.trim()) return;

    if (!window.kakao) {
      console.error("Kakao Maps API is not loaded");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchValue, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const places = data.map((place: any) => ({
          place_name: place.place_name,
          address_name: place.address_name,
          road_address_name: place.road_address_name,
          x: place.x,
          y: place.y,
        }));
        setPlaces(places);

        // 첫 검색 결과를 지도 중심으로 설정
        if (places.length > 0) {
          setMapCenter({
            lat: parseFloat(places[0].y),
            lng: parseFloat(places[0].x),
          });
        }
        setShowMap(true); // 지도 표시
      } else {
        console.error("No results found or error occurred");
        setPlaces([]);
        setShowMap(false);
      }
    });
  }, [searchValue]);

  const handleMarkerClick = (place: Place, index: number) => {
    // 지도 중심을 클릭된 마커로 이동
    setMapCenter({ lat: parseFloat(place.y), lng: parseFloat(place.x) });

    // 리스트의 첫 번째 항목을 클릭된 장소로 설정
    setPlaces((prevPlaces) => {
      const updatedPlaces = [...prevPlaces];
      const clickedPlace = updatedPlaces.splice(index, 1)[0];
      updatedPlaces.unshift(clickedPlace);
      return updatedPlaces;
    });
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <SearchInput
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="장소를 검색하세요"
          />
          <SearchButton onClick={() => setSearchValue(searchValue.trim())}>
            검색
          </SearchButton>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        {showMap && (
          <MapWrapper>
            <Map
              center={mapCenter}
              style={{ width: "100%", height: "400px" }}
              level={3}
            >
              {places.map((place, index) => (
                <MapMarker
                  key={index}
                  position={{
                    lat: parseFloat(place.y),
                    lng: parseFloat(place.x),
                  }}
                  onClick={() => handleMarkerClick(place, index)}
                >
                  <MarkerInfo>{place.place_name}</MarkerInfo>
                </MapMarker>
              ))}
            </Map>
            <PlacesList>
              {places.map((place, index) => (
                <PlaceItem key={index} onClick={() => handleAddress(place)}>
                  <strong>{place.place_name}</strong>
                  <p>{place.road_address_name || place.address_name}</p>
                </PlaceItem>
              ))}
            </PlacesList>
          </MapWrapper>
        )}
      </ModalContainer>
    </ModalBackdrop>
  );
};

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 80%;
  max-width: 800px;
  height: 80%;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CloseButton = styled.button`
  margin-left: 8px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }
`;

const MapWrapper = styled.div`
  margin-top: 16px;
`;

const PlacesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 16px;
  height: 400px;
  overflow-y: scroll;
  scrollbar-width: none;
`;

const PlaceItem = styled.li`
  padding: 8px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }

  strong {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    color: #555;
  }
`;

const MarkerInfo = styled.div`
  padding: 4px 8px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
`;
