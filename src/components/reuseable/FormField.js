import React from "react";
// import Select from "react-select";
import { Select } from 'antd';
const FormField = ({sl,refs,handleKeyPress, label, name, value, type, onChange, options, error }) => {
  const Option = Select.Option;
 
  return (

    <div className="form-group">
    <label htmlFor="accntno" className="col-sm-4 control-label">{label}</label>
    <div className="col-sm-8">
    {type === "select" ? (
                           <Select
                         // Custom filtering handled via `onSearch`
                           ref={refs}
                             onKeyDown={(event) => handleKeyPress(event, sl)}
                           required
                           className=""
                           showSearch
                           
                           placeholder="Select.."
                           optionLabelProp="label"
               style={{    width: "100%",
              
                fontSize: "14px"
              }}
                           name={name}
                           onChange={onChange}
                           value={value}
                           filterOption={(input, option) =>
                             (option.label ?? '').toLowerCase().includes(input.toLowerCase())
                           }
                         >
                           {options?.map((option) => (
                             <Option key={option.value} value={option.value} label={option.label}>
                              <div style={{display:"flex",flexDirection:'row'}}>
                              <div  style={{display:'flex',flexDirection:'column'}}>
                                 <span className="form-body" style={{fontSize:"12px",fontWeight:'bold'}}>{option.label}</span>
                                 <span className="form-body" style={{fontSize:"10px",color:'grey'}}>{option.address}</span>
                             <div style={{display:"flex",flexDirection:'row'}}>
                             <span className="form-body" style={{fontSize:"10px",color:'grey'}}>{option.contact}</span>
                             <span className="form-body" style={{fontSize:"8px",color:'white',backgroundColor:'red',padding:'0px 5px',borderRadius:'15%'}}>{option.type}</span>
                             </div>
                               
                               </div>
                              
                              </div>
                            
                             </Option>
                           ))}
                         </Select>
                     
            ) : (
              <input
                required
                ref={refs}
                onKeyPress={(event) => handleKeyPress(event, sl)}
                className="form-control"
                type={type}
                value={value}
                name={name}
                placeholder={name==="Remarks"?"#O/L_#O/S_":label}
                autoComplete="off"
                onChange={onChange}
                id={name}
                
              />
            )}

    </div>
  </div>
   
  );
};

export default FormField;
