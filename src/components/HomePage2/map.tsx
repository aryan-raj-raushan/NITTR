// src/components/StreetView.tsx
import React, { useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const StreetViewComponent: React.FC = () => {
  const streetViewRef = useRef<HTMLDivElement | null>(null);
  const streetView = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (streetViewRef.current) {
      const panorama = new google.maps.StreetViewPanorama(streetViewRef.current, {
        position: { lat: 37.86926, lng: -122.254811 },
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
      });
      streetView.current = panorama;
    }
  }, []);

  return <div ref={streetViewRef} style={{ height: '100vh', width: '100%' }} />;
};

const render = (status: Status): React.ReactElement => {
  if (status === Status.LOADING) return <div>Loading...</div>;
  if (status === Status.FAILURE) return <div>Error loading maps</div>;
  return <></>;
};

const StreetView: React.FC = () => {
  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!} render={render}>
      <StreetViewComponent />
    </Wrapper>
  );
};

export default StreetView;
