import React, {Fragment} from 'react';
import {Text, Button, Icon, Grid, Row, Col} from 'native-base';
import globalStyles from '../../../../styles/globalStyle';

const OrderQty = ({data, removeItem, transport_mode}) => {
  const RenderItem = ({item, index}) => {
    return (
      <Row
        size={1}
        style={{
          borderWidth: 0.2,
          borderColor: 'black',
        }}>
        {transport_mode === 'Self Owned Transport' ? (
          <Col size={2} style={globalStyles.siteCol}>
            <Text style={globalStyles.siteItem}>{item.vehicle}</Text>
          </Col>
        ) : (
          <Fragment></Fragment>
        )}
        <Col size={1} style={globalStyles.siteCol}>
          <Text style={globalStyles.siteItem}>{item.capacity}</Text>
        </Col>
        <Col size={2} style={globalStyles.siteCol}>
          <Text style={globalStyles.siteItem}>{item.truckload}</Text>
        </Col>
        <Col size={1}>
          <Button transparent small onPress={() => removeItem(index)}>
            <Icon name="delete" type="AntDesign" style={{color: 'red'}} />
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <Grid
      style={{
        width: '100%',
        marginHorizontal: 0,
      }}>
      {data.length == 0 ? (
        <Text></Text>
      ) : (
        <Row
          size={1}
          style={{
            borderWidth: 0.2,
            borderColor: 'black',
            backgroundColor: 'grey',
          }}>
          {transport_mode === 'Self Owned Transport' ? (
            <Col size={2} style={globalStyles.siteCol}>
              <Text style={globalStyles.siteItem}>{'Vehicle'}</Text>
            </Col>
          ) : (
            <Fragment></Fragment>
          )}
          <Col size={1} style={globalStyles.siteCol}>
            <Text style={globalStyles.siteItem}>{'Capacity'}</Text>
          </Col>
          <Col size={2} style={globalStyles.siteCol}>
            <Text style={globalStyles.siteItem}>{'Truck Load'}</Text>
          </Col>
          <Col size={1}></Col>
        </Row>
      )}

      {data.map((val, index) => {
        return <RenderItem item={val} index={index} key={index} />;
      })}
    </Grid>
  );
};

export default OrderQty;
