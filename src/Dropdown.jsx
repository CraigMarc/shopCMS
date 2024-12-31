 //dropdown form


 function Dropdown(props) {

    const {

       dataName,
       setForm,
       data_id,
       dataForm,
       labelName
    
      } = props;

    // change cat
  function changeCategory(e) {

    let index = dataName.findIndex(
      (temp) => temp['name'] == e.target.value)


    data_id.current = dataName[index]._id
    setForm(e.target.value)
  }

    return (
      <div>

        <label>{labelName}</label>
        <select required value={dataForm} onChange={(e) => changeCategory(e)}>

          {dataName.map((item, iter) => {
            let category = item.name


            return (
              <option id={iter} key={iter}>{category}</option>

            )
          })}
        </select>


      </div>
    )

  }


  export default Dropdown;