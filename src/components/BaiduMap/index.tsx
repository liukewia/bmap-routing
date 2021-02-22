import {
  Map,
  Marker,
  NavigationControl,
  MapApiLoaderHOC,
} from 'react-bmapgl';

const BaiduMap = () => {

  return (
    <Map
      style={{ height: 500 }}
      center={new BMapGL.Point(116.4, 39.91)}
      zoom={11}
      // enableDragging={true}
      // enableScrollWheelZoom={true}
    >
      <Marker position={new BMapGL.Point(116.4, 39.91)} icon="start" />
      <NavigationControl />
    </Map>
  );
};

export default MapApiLoaderHOC({
  ak: 'OalRnqTPhFKA9F4CwPQwCtprspgDqGG3'
})(BaiduMap);
