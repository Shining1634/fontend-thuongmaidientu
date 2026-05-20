import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Drawer, List, Row } from 'antd';
import moment from 'moment-timezone';
import { useState } from 'react';
import { MdOutlineAttachMoney } from 'react-icons/md';


const DrawerViewOrder = (props) => {

    const {
        openViewDH, dataViewDH, setOpenViewDH, setDataViewDH
    } = props    

    const cancel = () => {
        setOpenViewDH(false)
        setDataViewDH(null)
    }
    return (
        <Drawer
            closable
            destroyOnClose
            title={<p >CHI TIẾT ĐƠN HÀNG <span style={{color: "navy", fontWeight: "bold"}}>#{dataViewDH?._id.slice(-6)}</span></p>}
            placement="right"
            open={openViewDH}
            onClose={cancel}
            width={600}
            style={{fontSize:"14px"}}
        >
            {/* {dataViewDH?.products?.map((item, index) => {
                return (
                    <>
                    <Card 
                        type="inner" 
                        style={{border: "none"}}
                        title={
                        <>
                            <Avatar shape="square" size={100} icon={<UserOutlined />} />
                        </>}                     
                    >
                        <span style={{paddingLeft: "10px"}}>{item?._idSP.TenSP}</span>
                    </Card>  
                    </>              
                )
            })} */}
            <div className="blog-sidebar-single-wized with-title"  style={{fontSize:"14px"}}>
                <h4 className="title">Chi tiết đơn hàng - ngày đặt: &nbsp; {moment(dataViewDH?.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY (HH:mm:ss)')}</h4>
                <div className="latest-post-small-area-wrapper"  style={{fontSize:"14px"}}>
                {dataViewDH?.products?.map((item, index) => {
                    return (
                        <>
                        <div className="single-latest-post-area">
                            <img style={{width:"80px"}} src={item?._idSP.Image} alt="thumbnail" />                            
                            <div className="inner-content-area">
                                <a>
                                    <h5 className="title-sm-blog" style={{fontSize:"14px"}}>
                                    {item?._idSP.TenSP}
                                    </h5>
                                </a> 
                                <div style={{marginTop: "5px"}} className="icon-top-area">
                                    Số lượng đặt: <span style={{color: "navy"}}>{item?.quantity}</span> ---
                                    <p>
                                        Tổng tiền:
                                        <span style={{color: "red"}}> {item?.price.toLocaleString()} VNĐ</span>
                                    </p> 
                                </div>
                                <p style={{marginTop: "8px"}}>
                                    Cấu hình: <span style={{color: "navy"}}>{item?.size}</span>
                                </p>                                
                            </div>
                        </div>
                        <Divider/>
                        </>
                    )
                })}
                <p>Địa chỉ giao hàng: <span style={{color: "navy"}}>{dataViewDH?.address}</span></p>
                <p>Số điện thoại đặt hàng: <span style={{color: "navy"}}>{dataViewDH?.phone}</span></p>
                </div>
            </div>

        </Drawer>
    )
}
export default DrawerViewOrder