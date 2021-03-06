import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class AllPublishedProjList extends React.Component {
	constructor(props)
	{
		super(props);
	}
	render()
	{
		var allPublishedProjects = this.props.allPublishedProjects;
		if(allPublishedProjects.length === 0)
		{
			return (
				<div>
					<p className="fl-sub-header">All Published Projects</p>
					<p>(no published projects)</p>
				</div>
			)
		}
		return (
			// list of projects
			<div>
				<p className="fl-sub-header">All Published Projects</p>
				<ul>
					{
						allPublishedProjects.map((project) =>
							<li key={project._id}>
								<div className="fl-project-info-container">
									<p className="fl-project-title"><Link to={"/project_details/" + project._id} >{project.project_name}</Link></p>
									<div className="fl-list-row">
										<span className="fl-list-label">Description: </span>
										<span className="fl-project-desc">{project.project_description}</span>
									</div>
									<div className="fl-list-row">
										<span className="fl-list-label">Required Skills: </span>
										<span className="fl-project-skills">{project.project_skills}</span>
									</div>
									<div className="fl-list-row">
										<span className="fl-list-label">Budget Range: </span>
										<span className="fl-project-budget-range">{project.project_budget_range}</span> 
									</div>
									<div className="fl-list-row">
										<span className="fl-list-label">Status: </span>
										<span className="fl-project-budget-range">{project.project_status}</span> 
									</div>

								</div>
							</li>
						)
					}
					
				</ul>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  allPublishedProjects: state.allPublishedProjects.items,
  error: state.allPublishedProjects.error
});

export default connect(mapStateToProps)(AllPublishedProjList);
