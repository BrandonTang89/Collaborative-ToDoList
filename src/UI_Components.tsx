import React, { useEffect, useReducer, useState } from 'react';
import { Search, Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
interface searchBoxRep { key: string, title: string, description: string, tags: Array<string>, taskStatus: string };
export function SearchBox(props: { source: Array<searchBoxRep>, searchInDesc: boolean, updateValue: any }) {
  const initialState = {
    loading: false,
    results: [],
    value: '',
  }
  function SearchBoxReducer(state: any, action: any) {
    switch (action.type) {
      case 'CLEAN_QUERY':
        return initialState
      case 'START_SEARCH':
        return { ...state, loading: true, value: action.query }
      case 'FINISH_SEARCH':
        return { ...state, loading: false, results: action.results }
      case 'UPDATE_SELECTION':
        return { ...state, value: action.selection }

      default:
        throw new Error()
    }
  }
  const [state, dispatch] = useReducer(SearchBoxReducer, initialState)
  const { loading, results, value } = state

  // Update results while typing
  const timeoutRef = React.useRef(0)
  const handleSearchChange = React.useCallback((e: any, data: any) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = window.setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i');
      const isMatch = !props.searchInDesc ? (result: any) => re.test(result.title) : (result: any) => re.test(result.title) || re.test(result.description);
      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(props.source, isMatch),
      })
    }, 300)
  }, [props.source, props.searchInDesc])
  useEffect(() => {
    dispatch({ type: 'FINISH_SEARCH', results: props.source })
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [props.source])

  useEffect(() => { props.updateValue(value) }, [value, props]);

  return (

    <Search
      fluid
      size='large'
      loading={loading}
      placeholder='Search...'
      onResultSelect={(e, data) => {
        dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title });
      }}
      onSearchChange={handleSearchChange}
      results={results}
      value={value}
    />

  )
}

export const TagDropDown = (props: { tagSet: Array<string>, onChange: any, currentTags: Array<string> }) => {
  let initOptions: Array<{ key: string, text: string, value: string }> = [];
  props.tagSet.forEach(tag => {
    initOptions.push({ key: tag, text: tag, value: tag });
  });

  const [options, setOptions] = useState(initOptions);

  const handleAddition = (e: {}, { value }: any) => {
    setOptions([{ key: value, text: value, value: value }, ...options]);
  }
  const handleChange = (e: {}, { value }: any) => { props.onChange(value); }
  return (
    <Dropdown
      options={options}
      value={props.currentTags}
      placeholder='Select Tag'
      search
      selection
      fluid
      multiple
      allowAdditions
      onAddItem={handleAddition}
      onChange={handleChange}
    />
  );
}

export const UsersDropDown = (props: { onChange: any, currentUsers: Array<string> }) => {
  let initOptions: Array<{ key: string, text: string, value: string }> = [];
  props.currentUsers.forEach(user => {
    initOptions.push({ key: user, text: user, value: user });
  });
  const [options, setOptions] = useState(initOptions);

  const handleAddition = (e: {}, { value }: any) => {
    setOptions([{ key: value, text: value, value: value }, ...options]);
  }
  const handleChange = (e: {}, { value }: any) => { props.onChange(value); }
  return (
    <Dropdown
      options={options}
      value={props.currentUsers}
      placeholder='Select Users'
      search
      selection
      fluid
      multiple
      allowAdditions
      onAddItem={handleAddition}
      onChange={handleChange}
    />
  );
}