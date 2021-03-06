import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import {View} from 'react-native';

import {
  Container,
  Text,
  Grid,
  Row,
  Col,
  Button,
  Icon,
  Content,
} from 'native-base';
import SpinnerScreen from '../../../base/SpinnerScreen';
import globalStyle from '../../../../styles/globalStyle';
import {
  setLoading,
  callAxios,
  handleError,
} from '../../../../redux/actions/commonActions';
import {startVehicleDeregistration} from '../../../../redux/actions/siteActions';

export const VehicleDetail = ({
  userState,
  commonState,
  navigation,
  handleError,
  setLoading,
  startVehicleDeregistration,
}) => {
  const [vehicle, setVehicle] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const toggleAlert = () => {
    setShowAlert(!showAlert);
  };

  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setLoading(true);
      getVehicleStatus(navigation.state.params.id);
    }
  }, []);

  const getVehicleStatus = async id => {
    try {
      const response = await callAxios(`resource/Vehicle/${id}`);
      setVehicle(response.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
    <Container>
      {showAlert && (
        <View style={{width: '100%', height: '100%'}}>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Remove Vehicle"
            message="Are you sure you want to remove vehicle"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Yes, remove it"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
              toggleAlert();
            }}
            onConfirmPressed={() => {
              toggleAlert();
              startVehicleDeregistration({vehicle: vehicle.name});
            }}
          />
        </View>
      )}
      <Grid style={{marginTop: 5}}>
        {vehicle.vehicle_status === 'Active' ? (
          <Row
            style={{
              height: 55,
              borderBottomWidth: 1,
              borderBottomColor: 'green',
            }}>
            <Col>
              <Button
                vertical
                transparent
                style={{alignSelf: 'center'}}
                onPress={() =>
                  navigation.navigate('UpdateDriver', {
                    id: vehicle.name,
                    driver_name: vehicle.drivers_name,
                    driver_mobile_no: vehicle.contact_no,
                  })
                }>
                <Icon
                  name="drivers-license"
                  type="FontAwesome"
                  style={{color: 'blue'}}
                />
                <Text style={{color: 'blue'}}>Update Driver Info</Text>
              </Button>
            </Col>

            <Col>
              <Button
                vertical
                transparent
                style={{alignSelf: 'center'}}
                onPress={() => toggleAlert()}>
                <Icon
                  name="truck-loading"
                  type="FontAwesome5"
                  style={{color: 'red'}}
                />
                <Text style={{color: 'red'}}>Deregister</Text>
              </Button>
            </Col>
          </Row>
        ) : (
          <Text></Text>
        )}

        <Content style={globalStyle.content}>
          <Row style={globalStyle.labelContainer}>
            <Col size={2}>
              <Text style={globalStyle.label}>Vehicle Status</Text>
            </Col>
            <Col size={3}>
              {vehicle.vehicle_status === 'Suspended' ? (
                <Text style={{color: 'red', fontWeight: 'bold'}}>
                  Suspended
                </Text>
              ) : (
                <Text style={{color: 'blue', fontWeight: 'bold'}}>Active</Text>
              )}
            </Col>
          </Row>

          <Row style={globalStyle.labelContainer}>
            <Col size={2}>
              <Text style={globalStyle.label}>Vehicle Number</Text>
            </Col>
            <Col size={3}>
              <Text>{vehicle.name}</Text>
            </Col>
          </Row>

          <Row style={globalStyle.labelContainer}>
            <Col size={2}>
              <Text style={globalStyle.label}>Vehicle Capacity</Text>
            </Col>
            <Col size={3}>
              <Text>{vehicle.vehicle_capacity} m3</Text>
            </Col>
          </Row>

          <Row style={globalStyle.labelContainer}>
            <Col size={2}>
              <Text style={globalStyle.label}>Driver's Name</Text>
            </Col>
            <Col size={3}>
              <Text>{vehicle.drivers_name}</Text>
            </Col>
          </Row>

          <Row style={globalStyle.labelContainer}>
            <Col size={2}>
              <Text style={globalStyle.label}>Driver's Contact No</Text>
            </Col>
            <Col size={3}>
              <Text>{vehicle.contact_no}</Text>
            </Col>
          </Row>

          <Row style={globalStyle.labelContainer}>
            <Col size={2}>
              <Text style={globalStyle.label}>Driver's CID</Text>
            </Col>
            <Col size={3}>
              <Text>{vehicle.driver_cid}</Text>
            </Col>
          </Row>
        </Content>
      </Grid>
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  handleError,
  setLoading,
  startVehicleDeregistration,
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleDetail);
