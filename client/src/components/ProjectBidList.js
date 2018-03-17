import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class ProjectBidList extends React.Component {
	constructor(props)
	{
		super(props);
		this.onHire = this.onHire.bind(this);
	}
	render()
	{
		var projectBidList = this.props.projectBidList;
		return(
			<div>
				<p>Project Bids</p>
				<ul>

					{
						projectBidList.map((bid) =>
							<li key={bid.bid_id}>
								<div className="bid-indo-container">
									<div>
										<h3 className="bid-bidder-name"><Link to={"/user_profile/" + bid.bidder_id} >{bid.user_name}</Link></h3>
										<p className="bid-price">{bid.bid_price}</p>
										<p className="bid-period">{bid.bid_period}</p>
									</div>
									<div>
										{
											bid.employer_id === this.props.userInfo.user_id && 
											<button onClick={this.onHire(bid.bid_id)}>Hire</button>
										}
									</div>

								</div>
							</li>
						)
					}
					
				</ul>
			</div>
		)
	}

	onHire(bidID)
	{
		
	}
}

const mapStateToProps = state => ({
  projectBidList: state.projectDetails.bids,
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(ProjectBidList);
