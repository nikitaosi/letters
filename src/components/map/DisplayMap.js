import React, {Component} from 'react';
import propTypes from 'prop-types';

export default class DisplayMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapLoaded: false,
            location: {
                lat: props.location.lat,
                lng: props.location.lng,
                name: props.location.name
            }
        };
        this.ensureMapExists = this.ensureMapExists.bind(this);
        this.updateMapPosition = this.updateMapPosition.bind(this);
        this.generateStaticMapImage = this.generateStaticMapImage.bind(this);
    }
    
    static propTypes = {
        location: propTypes.shape({
            lat: propTypes.number,
            lng: propTypes.number,
            name: propTypes.string
        }),
        displayOnly: propTypes.bool
    };

    static defaultProps = {
        displayOnly: true,
        location: {
            lat: 55.751244,
            lng: 37.618423,
            name: null
        }
    };

    componentDidMount() {
        this.L = window.L;
        if (this.state.location.lng && this.state.location.lat) {
            this.ensureMapExists();
        }
    }

    componentDidUpdate() {
        if (this.map && !this.props.displayOnly) {
            this.map.invalidateSize(false);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location) {
            const locationsAreEqual = 
                Object.keys(nextProps.location).every(
                    k => nextProps.location[k] === this.props.location[k]
                );
                if (!locationsAreEqual) {
                    this.updateMapPosition(nextProps.location);
                }
        }
    }

    ensureMapExists() {
        if (this.state.mapLoaded) return;
        this.map = this.L.mapbox.map(this.mapNode);
        this.map.addLayer(this.L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
        this.map.setView(this.L.latLng(this.state.location.lat,
            this.state.location.lng), 12);
        this.addMarker(this.state.location.lat, this.state.location.lng);
        this.setState(() => ({ mapLoaded: true }));
    }

    updateMapPosition(location) {
        const {lat, lng} = location;
        this.map.setView(this.L.latLng(lat, lng));
        this.addMarker(lat, lng);
        this.setState(() => ({ location })); 
    }

    addMarker(lat, lng) {
        if (this.marker) {
            return this.marker.setLatLng(this.L.latLng(lat, lng));
        }
        this.marker = this.L.marker([lat, lng], {
            icon: this.L.mapbox.marker.icon({
                'marker-color': '#4469af'
            })
        });
        this.marker.addTo(this.map);
    }

    generateStaticMapImage(lat, lng) {
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${lat},${lng},12,0,0/600x175?access_token=${process
            .env.MAPBOX_API_TOKEN}`;
    }

    render() {
        return [
            <div key="DisplayMap" className="displayMap">
                <div 
                    className="map"
                    ref={node =>  {
                        this.mapNode = node;
                    }}
                >
                    {!this.state.mapLoaded && (
                        <img
                            className="map"
                            src={this.generateStaticMapImage(
                                this.state.location.lat,
                                this.state.location.lng
                            )}
                            alt={this.state.location.name}
                        />
                    )}
                </div>
            </div>,
            this.props.displayOnly && (
                <div key="location-description"
                    className="locationDescription">
                    <i className="location-icon fa fa-location-arrow" />
                    <span className="location-name">
                        {this.state.location.name}
                    </span>
                </div>
            )
        ]
    }
}