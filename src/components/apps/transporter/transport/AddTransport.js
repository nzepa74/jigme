import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {View, Image} from 'react-native';

import {
  Container,
  Input,
  Content,
  Form,
  Picker,
  Item,
  Button,
  Text,
  Card,
  CardItem,
  Icon,
  DeckSwiper,
} from 'native-base';
import {
  callAxios,
  handleError,
  getImages,
  setLoading,
} from '../../../../redux/actions/commonActions';
import {startTransportRegistration} from '../../../../redux/actions/transportActions';
import globalStyles from '../../../../styles/globalStyle';
import SpinnerScreen from '../../../base/SpinnerScreen';

export const AddTransport = ({
  userState,
  commonState,
  navigation,
  startTransportRegistration,
  handleError,
  getImages,
  setLoading,
}) => {
  //state info for forms
  const [vehicle_no, setVehicle_no] = useState('');
  const [vehicle_capacity, setVehicle_capacity] = useState(undefined);
  const [drivers_name, setdrivers_name] = useState(undefined);
  const [contact_no, setcontact_no] = useState(undefined);
  const [owner_cid, setowner_cid] = useState(undefined);
  const [registration_document, setregistration_document] = useState([]);
  const [images, setImages] = useState([]);

  //all values
  const [all_capacities, setall_capacities] = useState([]);

  //For proper navigation/auth settings
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      //get all capacities
      setLoading(true);
      getCapacities();
    }
  }, []);

  useEffect(() => {
    setImages([]);
    setTimeout(() => {
      setImages(registration_document);
    }, 600);
  }, [registration_document]);

  //image picker
  const getBluebook = async () => {
    const bluebooks = await getImages('Bluebook');
    setregistration_document(bluebooks);
  };

  const getCapacities = async () => {
    try {
      const all_st = await callAxios('resource/Vehicle Capacity');
      setall_capacities(all_st.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const submitVehicleInfo = async () => {
    const vehicle_info = {
      approval_status: 'Pending',
      user: userState.login_id,
      common_pool: 1,
      vehicle_no: vehicle_no.toUpperCase(),
      vehicle_capacity,
      drivers_name,
      contact_no,
      owner_cid,
    };

    startTransportRegistration(vehicle_info, registration_document);
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
    <Container>
      <Content style={globalStyles.content}>
        <Form>
          <Item regular style={globalStyles.mb10}>
            <Input
              value={vehicle_no}
              onChangeText={val => setVehicle_no(val)}
              placeholder="Vehicle No."
            />
          </Item>

          <Item regular style={globalStyles.mb10}>
            <Input
              value={owner_cid}
              onChangeText={val => setowner_cid(val)}
              placeholder="Owner's CID"
            />
          </Item>

          <Item regular style={globalStyles.mb10}>
            <Picker
              mode="dropdown"
              selectedValue={vehicle_capacity}
              onValueChange={val => setVehicle_capacity(val)}>
              <Picker.Item
                label={'Select Vehicle Capacity'}
                value={undefined}
                key={-1}
              />
              {all_capacities &&
                all_capacities.map((pur, idx) => {
                  return (
                    <Picker.Item label={pur.name} value={pur.name} key={idx} />
                  );
                })}
            </Picker>
          </Item>

          <Item regular style={globalStyles.mb10}>
            <Input
              value={drivers_name}
              onChangeText={val => setdrivers_name(val)}
              placeholder="Driver Name"
            />
          </Item>
          <Item regular style={globalStyles.mb10}>
            <Input
              value={contact_no}
              onChangeText={val => setcontact_no(val)}
              placeholder="Driver's Contact No"
            />
          </Item>

          <Button info style={globalStyles.mb10} onPress={getBluebook}>
            <Text>Attach Bluebook</Text>
          </Button>

          {images.length === 0 ? null : (
            <View style={{height: 300, width: '100%', marginBottom: 20}}>
              <Text style={{alignSelf: 'center', color: 'red'}}>
                Swipe to review all images
              </Text>
              <DeckSwiper
                dataSource={registration_document}
                renderItem={image => (
                  <Card style={{elevation: 3}}>
                    <CardItem cardBody>
                      <Image
                        source={{
                          uri: image.path,
                        }}
                        style={{height: 250, width: '100%'}}
                      />
                    </CardItem>
                    <CardItem>
                      <Icon name="heart" style={{color: '#ED4A6A'}} />
                      <Text>
                        {image.path.substring(image.path.lastIndexOf('/') + 1)}
                      </Text>
                    </CardItem>
                  </Card>
                )}
              />
            </View>
          )}
          <View style={{marginBottom: 20}}></View>

          <Button success style={globalStyles.mb50} onPress={submitVehicleInfo}>
            <Text>Submit for Approval</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  startTransportRegistration,
  handleError,
  getImages,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTransport);
