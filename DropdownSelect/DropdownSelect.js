import React, { useEffect, useRef, useState } from "react";
import "./DropdownSelect.css";

const Icon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};

const CloseIcon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
    </svg>
  );
};

const DropdownSelect = ({
  options,
  onChange,
  placeHolder,
  isMulti,
  isClearable,
  isSearch,
  isCheckbox,
  closeMenu,
  fixedSearch,
  removeSelected,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(isMulti ? [] : null);

  let menuOpen = closeMenu != undefined ? closeMenu : true;

  const inputRef = useRef();
  const toggle = () => setOpen(!open);

  const handler = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (searchValue != "") {
      setSearchValue("");
    }
  }, [open]);

  useEffect(() => {
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const getOptions = () => {
    if (!searchValue) {
      return options;
    } else {
      let allOptions = options.filter(
        (option) =>
          option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
      );
      return allOptions;
    }
  };

  const removeOption = (option) => {
    return selectedValue.filter((current) => current.value !== option.value);
  };

  const handleOnClick = (option) => {
    let newValue;
    if (isMulti) {
      if (!selectedValue.some((current) => current.value === option.value)) {
        newValue = [...selectedValue, option];
      } else {
        // let selectionAfterRemoval = selectedValue;
        // selectionAfterRemoval = selectionAfterRemoval.filter(
        //   (current) => current.value !== option.value
        // );
        // newValue = [...selectionAfterRemoval];
        newValue = removeOption(option);
      }
    } else {
      newValue = option;
      // setOpen(!open)
    }
    if (menuOpen) {
      setOpen(!open);
    }
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isSelected = (option) => {
    if (isMulti) {
      return selectedValue.filter((o) => o.value === option.value).length > 0;
    }

    if (!selectedValue) {
      return false;
    }

    return selectedValue.value === option.value;
  };

  const onTagRemove = (e, option) => {
    // e.stopPropagation();
    const newValue = removeOption(option);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
      return (
        <div className="dd-placeholder">
          {placeHolder ? placeHolder : "Select..."}
        </div>
      );
    }
    if (isMulti) {
      return (
        <div
          className="dd-tags"
          title={selectedValue.map((val) => val.label.toLocaleString())}
        >
          {selectedValue &&
            selectedValue.map((option) => (
              <div key={option.value} className="dd-tag-item">
                {option.label}
                {/* {selectedValue.length === 1
                            ? option.label
                            : selectedValue.length} */}
                {removeSelected && (
                  <span
                    onClick={(e) => onTagRemove(e, option)}
                    className="dd-tag-close"
                  >
                    <CloseIcon />
                  </span>
                )}
              </div>
            ))}
        </div>
      );
    }
    return selectedValue.label;
  };

  const getIcons = () => {
    if (isMulti && isClearable && selectedValue.length > 0) {
      // if (isMulti && selectedValue.length > 0) {
      return <CloseIcon />;
    } else if (
      !isMulti &&
      isClearable &&
      selectedValue &&
      Object.keys(selectedValue).length > 1
    ) {
      return <CloseIcon />;
    } else {
      return <Icon />;
    }
  };

  const clearDropdown = () => {
    if (isMulti && isClearable) {
      setSelectedValue([]);
      onChange([]);
    } else if (!isMulti && isClearable) {
      setSelectedValue(null);
      onChange("");
    } else {
      return;
    }
  };

  const inputCheckHandler = (event) => {
    const updatedCheck = event.target.value;
    return updatedCheck;
  };

  const isChecked = (option, key) => {
    if (isMulti) {
      if (
        key === "checkboxOpt" &&
        selectedValue &&
        selectedValue.find((current) => current.value === option.value)
      ) {
        return true;
      }
    } else if (
      !isMulti &&
      selectedValue &&
      selectedValue.value === option.value
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="dd-container" ref={inputRef}>
      <div className="dd-header" onClick={() => toggle(!open)}>
        <div className="dd-title">
          {/* {selection && Object.keys(selection).length > 0
            ? selection.label
            : title} */}
          {/* {title} */}
          {getDisplay()}
        </div>
        <div className="dd-action" onClick={() => clearDropdown()}>
          {getIcons()}
          {/* <Icon /> */}
          {/* {open ? <DropDownIndicator /> : <DropDownIndicator />} */}
        </div>
      </div>

      {open && (
        <ul className="dd-list">
          {isSearch && (
            <div className={!fixedSearch ? "dd-search" : "dd-search fixed"}>
              <input
                autoFocus
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search available"
                value={searchValue || ""}
              />
              {/* <SearchIcon /> */}
            </div>
          )}
          {getOptions().map((option, index) =>
            isCheckbox ? (
              <li className="dd-list-item" key={option.label + index}>
                {/* <div className={`dd-value ${isSelected(option) && "selected"}`}> */}
                <label
                  htmlFor={option.value}
                  className={`dd-value ${isSelected(option) && "selected"}`}
                >
                  <input
                    onClick={() => handleOnClick(option)}
                    type="checkbox"
                    id={option.value}
                    checked={isChecked(option, "checkboxOpt")}
                    onChange={(event) => inputCheckHandler(event)}
                  />
                  {/* <span className="dd-check"></span> */}
                  {option.label}
                </label>
                {/* </div> */}
              </li>
            ) : (
              <li className="dd-list-item" key={option.label + index}>
                <div
                  className={`dd-value ${isSelected(option) && "selected"}`}
                  //   className={
                  //     activeIndex === item.value
                  //       ? "selected-dd-value active"
                  //       : "selected-dd-value inactive"
                  //   }
                  onClick={() => handleOnClick(option)}
                >
                  <span>{option.label}</span>
                </div>
              </li>
            )
          )}
          {getOptions().length === 0 && (
            <div className="dd-item-no-data">No data found</div>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelect;
