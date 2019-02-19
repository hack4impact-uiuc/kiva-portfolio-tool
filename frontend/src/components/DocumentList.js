import React from 'react'
import { Container, Row, Table, Col, FormGroup, Label, Input } from 'reactstrap'
import Link from 'next/link'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addFilter, removeFilter } from '../actions'
//import { getCandidates, setCandidateStatus } from '../utils/api'
//import CandidateStatus from '../components/candidateStatus'
//import CandidateLinksBadge from '../components/candidateLinksBadge'
import FilterComponent from '../components/filterComponent'
import ChangeStatus from '../components/changeStatus'
import ErrorMessage from '../components/errorMessage'
// import { avgInterviewScore, compareByAvgInterviewScore, getNumOfInterviews } from '../utils/core'
import { Constants } from '../utils/Constants'
import { MockData } from '../utils/MockData'
import { selectByEnum } from '../utils/enums'
import Nav from '../components/nav'

type Props = {}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addFilter,
      removeFilter
    },
    dispatch
  )
}

const mapStateToProps = state => ({
  documents: state.documentListPage.documents,
  loading: state.documentListPage.documentsLoading,
  error: state.documentListPage.documentsError,
  filters: state.documentListPage.filters,
  sort: state.documentListPage.sort
})

var sortByProperty = function(property) {
  return function(x, y) {
    return x[property] === y[property] ? 0 : x[property] > y[property] ? 1 : -1
  }
}

var sortByMultipleProperties = function(property1, property2) {
  return function(x, y) {
    return x[property1][property2] === y[property1][property2]
      ? 0
      : x[property1][property2] > y[property1][property2]
        ? 1
        : -1
  }
}

class DocumentList extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      documents: this.props.documents,
      error: this.props.error,
      loading: this.props.loading,
      filters: this.props.filters,
      search: ''
    }
  }
  async componentDidMount() {
    const res = await getDocuments()
    this.setState({
      documents: res.result === undefined ? [] : res.result
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filters: nextProps.filters
    })
  }
  handleSearchInput = e => {
    this.setState({
      search: e.target.value
    })
  }
  handleChange = e => {
    let newDocuments = this.state.documents.map(doc => {
      if (doc._id === e.target.name) {
        doc.status = e.target.value
      }
      return doc
    })
    setDocumentStatus(e.target.name, e.target.value)
    this.setState({ documents: newDocuments })
  }

  render() {
    if (this.state.documents === undefined) {
      return <ErrorMessage code="404" message="Documents is undefined. Check backend." />
    }
    let filteredDocuments = this.state.documents
      .filter(x => this.state.filters.statuses.includes(x.status))
      .filter(x => this.state.filters.types.includes(x.type))
      .filter(x => this.state.filters.latestUploadTimes.includes(x.uploadTime))
      .filter(x => x.name.toLowerCase().includes(this.state.search.toLowerCase()))
    // TODO: Convert these cases into enum comparisons
    switch (this.state.filters.sortBy[0]) {
      case 'Name':
        filteredDocuments = filteredDocuments.sort(sortByProperty('name'))
        break
      case 'Document Type':
        filteredDocuments = filteredDocuments.sort(sortByProperty('type'))
        break
      case 'Status':
        filteredDocuments = filteredDocuments.sort(sortByProperty('status'))
        break
      case 'Last Uploaded':
        filteredDocuments = filteredDocuments.sort(sortByProperty('uploadTime'))
        break
    }
    let selects = this.state.filters.selectBy
    return (
      <>
        <Nav />
        <div className="page-content-wrapper">
          <Container fluid>
            <Row>
              <Col lg="2" sm="3" className="ml-2">
                <FilterComponent />
              </Col>
              <Col lg="7" sm="8">
                <Container>
                  <Row>
                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="search" />
                        <Input
                          type="search"
                          id="search"
                          value={this.state.search}
                          placeholder="Search Documents"
                          onChange={this.handleSearchInput}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Table size="m" hover className="document-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          {selects.includes('Name') ? <th>Name</th> : <> </>}
                          {selects.includes('Document Type') ? <th>Document Type</th> : <> </>}
                          {selects.includes('Last Uploaded') ? <th>Last Uploaded</th> : <> </>}
                          {selects.includes('Status') ? <th>Status</th> : <> </>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments != undefined || filteredDocuments.length != 0 ? (
                          filteredDocuments.map((doc, key) => (
                            <tr key={doc._id}>
                              <th scope="row">{key + 1}</th>
                              {selects.includes('Name') ? (
                                <td>
                                  <Link
                                    href={{ pathname: '/document', query: { id: doc._id } }}
                                  >
                                    <a className="regular-anchor">{doc.name}</a>
                                  </Link>
                                </td>
                              ) : (
                                <> </>
                              )}
                              {selects.includes('Status') ? (
                                <td>
                                  <h6>
                                    <DocumentStatus status={doc.status} />
                                  </h6>
                                </td>
                              ) : (
                                <> </>
                              )}

                              {selects.includes('Document Type') ? <td>{doc.type}</td> : <> </>}
                              {selects.includes('Last Uploaded') ? (
                                <td>{doc.uploadTime}</td>
                              ) : (
                                <> </>
                              )}
                              <td>
                                <ChangeStatus
                                  documentID={doct._id}
                                  handleChange={this.handleChange}
                                />
                              </td>
                              <td>
                                <Link
                                  href={{ pathname: '/document', query: { id: doc._id } }}
                                >
                                  <a>
                                    <img height="10" src="/static/icons/external-icon.png" />
                                  </a>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <div className="center">
                            <p>No Documents exist given the filters.</p>
                          </div>
                        )}
                      </tbody>
                    </Table>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentList)
