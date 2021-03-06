import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// redux-actions
import { hireBid } from "../actions/HireBidActions";
import { sendNotification } from "../actions/HireBidActions";
import { updateProjStatus } from "../actions/UpdateProjectActions";
import { fetchProjBasicInfo } from "../actions/ProjectBasicInfoActions";
import { projectDataUtils } from "../utils/clientDataUtils";

class ProjectBidList extends React.Component {
	constructor(props)
	{
		super(props);
		this.onHire = this.onHire.bind(this);
	}
	render()
	{

		var projectBasic = this.props.projectBasic ? this.props.projectBasic : {};
		var projectBidList = projectBasic.bids ? projectBasic.bids : [];
		if(projectBidList.length === 0)
		{
			return(
				<div>
					<p className="fl-sub-header">Bids On This Project</p>
					<p> (no bids) </p>
				</div>	
			);
		}
		return(
			<div>
				<p className="fl-sub-header">Bids On This Project</p>
				<ul>

					{
						projectBidList.map((bid) =>
							{
								var bidder = bid.bidder ? bid.bidder : {};
								return(
									<li key={bid.bid_id}>
										<div className="fl-bid-info-container">
											<div className="fl-list-row">
												<span className="fl-list-label">Bidder: </span>
												<span className="fl-bid-bidder"><Link to={"/user_profile/" + bidder._id} >{bidder.user_name}</Link></span>
											</div>
											<div className="fl-list-row">
												<span className="fl-list-label">Bid Date: </span>
												<span className="fl-bid-price">{bid.bid_date}</span>
											</div>
											<div className="fl-list-row">
												<span className="fl-list-label">Price (USD): </span>
												<span className="fl-bid-price">{bid.bid_price}</span>
											</div>
											<div className="fl-list-row">
												<span className="fl-list-label">Period (Days): </span>
												<span className="fl-bid-period">{bid.bid_period}</span> 
											</div>
											<div className="fl-list-row">
												{
													this.props.projectBasic.employer_id === this.props.userInfo._id && this.props.projectBasic.project_status === "OPEN" &&
													<button className="btn btn-primary" onClick={this.onHire} bid_id={bid.bid_id} bidder_id={bid.bidder_id} >Hire</button>
												}
											</div>

										</div>
									</li>
								)	
							}
							
							
						)
					}
					
				</ul>
			</div>
		)
	}

	onHire(e)
	{
		e.preventDefault();

		var bidID = e.target.getAttribute("bid_id");
		var bidderID = e.target.getAttribute("bidder_id");

		var params = {
			bidID: bidID,
			projectID: this.props.projectBasic._id
		};

		this.props
			.hireBid(params)
			.then(() => {
				this.props.updateProjStatus(this.props.projectBasic._id, "STARTED"); // update project status to STARTED
			})
			.then(() => {
				this.props.fetchProjBasicInfo(this.props.projectBasic._id); // refresh page content
			})
			.then(() => {
				// send notification via email
				this.props.sendNotification({
					bidderID: bidderID
				})
			});
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
    hireBid: (params) => dispatch(hireBid(params)),
    fetchProjBasicInfo: (id) => dispatch(fetchProjBasicInfo(id)),
    sendNotification: (params) => dispatch(sendNotification(params)),
    updateProjStatus: (id, status) => dispatch(updateProjStatus(id, status))
  };
}
const mapStateToProps = state => ({
	projectBasic: state.projectDetails.basic,
	userInfo: state.userInfo
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBidList);
